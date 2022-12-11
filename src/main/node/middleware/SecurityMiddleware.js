const jwt = require('jsonwebtoken')
const ObjectHelper = require('$/src/main/node/common/ObjectHelper.js')
const HeimdallApiHelper = require('$/src/main/node/common/HeimdallApiHelper.js');

@Service
function SecurityMiddleware(){

  @Autowire(name = "configuration")
  this.configuration;

  @Autowire(name = "subjectService")
  this.subjectService;

  @Autowire(name = "permissionService")
  this.permissionService

  @Autowire(name = "express")
  this.express;  

  @Autowire(name = "rawDependencies")
  this.rawDependencies;    

  var permissionsByRouteStrings;
  
  this.configure = async () => {
    var heimdallApiHelper = new HeimdallApiHelper();
    permissionsByRouteStrings = heimdallApiHelper.getPermissionsByStringRoute(this.rawDependencies);
    this.express.use(this.ensureAuthorizationMiddleware)
  }

  this.ensureAuthorizationMiddleware = async (req, res, next) => {

    var url = req.originalUrl;
    if(typeof permissionsByRouteStrings[url] === 'undefined'){
      return next();
    }
    var permissionRawString = permissionsByRouteStrings[url];

    if(!ObjectHelper.hasProperty(this.configuration, "oauth2.jwtSecret")){
      res.status(500);
      return res.json({
        code: 500002,
        message: "Internal error"
      });
    }

    const authHeader = req.headers['authorization']
    if (authHeader == null){
      res.status(401);
      return res.json({
        code: 401001,
        message: "Missing token"
      });
    }
    //one space : https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
    const tokenInfo = authHeader.split(/\s{1}/)

    if (tokenInfo.length!=2){
      res.status(401);
      return res.json({
        code: 401002,
        message: "Token should be Bearer. Spec https://datatracker.ietf.org/doc/html/rfc6750#section-2.1"
      });
    }

    if (tokenInfo[0]!="Bearer"){
      res.status(401);
      return res.json({
        code: 401003,
        message: "Token should be Bearer"
      });
    }

    if (tokenInfo[1].length<5){
      res.status(401);
      return res.json({
        code: 401004,
        message: "Token is wrong"
      });
    }
    var token = tokenInfo[1]
    var payload;
    try {
      payload = await jwt.verify(token, this.configuration.oauth2.jwtSecret);
    } catch (e) {
      console.log(e);
      res.status(401);
      return res.json({
        code: 401005,
        message: "Invalid token"
      });
    }

    //TODO: validate payload.subject_identifier
    var subject;
    try{
      subject = await this.subjectService.findByIdentifier(payload.subject_identifier);
    }catch(e){
      console.log(e);
      res.status(403);
      return res.json({
        code: 403001,
        message: "You are not allowed"
      });
    }

    if(typeof subject ==='undefined'){
      res.status(403);
      return res.json({
        code: 403002,
        message: "You are not allowed"
      });
    }

    //validation for long live token
    //at this point, the token has a valid signature
    var lltu = payload.lltu;
    if(typeof lltu !== "undefined" && lltu != ""){
      //if token has a lltu is because was generated as long live token
      //no body can send a token with fake lltu (cornerstone of jwt)

      //get longLiveTokenUuid from database
      var longLiveTokenUuid = subject[0].longLiveTokenUuid;
      if(lltu != longLiveTokenUuid){
        return res.json({
          code: 403004,
          message: "You are not allowed"
        });
      }
    }
    
    var permissionScope = permissionRawString.split(":");
    var resource = `${permissionScope[0].trim()}:${permissionScope[1].trim()}`;
    var hasPermissions = await this.permissionService.hasPermissions(subject[0].role, resource, permissionScope[2].trim());

    if(!hasPermissions){
      res.status(403);
      return res.json({
        code: 403003,
        message: "You are not allowed"
      });
    }

    req.app.locals.secure_context = {
      subject_identifier: payload.subject_identifier,
      subject_id: subject[0].id
    }
    return next();
  }
}

module.exports = SecurityMiddleware;
