const include = require('nodejs-require-enhancer');
const escape = require('escape-html');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');

@Route
function Oauth2SpecRoutes() {

  @Autowire(name = "configuration")
  this.configuration;

  @Autowire(name = "oauth2SpecService")
  this.oauth2SpecService;

  @Autowire(name = "microsoftLoginService")
  this.microsoftLoginService;

  @Get(path = "/v1/oauth2/authorize-url")
  this.getAuthorizeUrl = (req, res) => {

    var signInEngine = this.configuration.getProperty("login.engine")
    var authorizeUrl;

    if(signInEngine === "microsoft"){
      authorizeUrl = this.microsoftLoginService.getAuthorizeUrl();
    }else if(signInEngine === "google"){
      return res.send({
        code: ApiResponseCodes.login_unsupported_engine.code,
        message: ApiResponseCodes.login_unsupported_engine.message
      });
    }else if(signInEngine === "default"){
      authorizeUrl = this.configuration.getProperty(`login.${signInEngine}.authorizeUrl`);
    }else{
      return res.send({
        code: ApiResponseCodes.login_unsupported_engine.code,
        message: ApiResponseCodes.login_unsupported_engine.message
      });
    }

    return res.send({
      code:200000,
      message:"success",
      content: {
        "engine": signInEngine,
        "authorizeUrl": authorizeUrl
      }
    });
  }  

  @Post(path = "/v1/oauth2/token")
  this.tokenRoute = async (req, res) => {

    if (!req.is('application/json') && !req.is('application/x-www-form-urlencoded')) {
      res.status(400);
      return res.json({
        code: 400001,
        message: "unsuported content type"
      });
    }

    try {
      var tokenResponse = await this.oauth2SpecService.generateToken(req.body);
      res.status(200);
      return res.json(tokenResponse);
    } catch (e) {
      console.log(e);
      res.status(500);
      return res.json({
        code: 500000,
        message: "internal error"
      });
    }
  }

  //https://www.rfc-editor.org/rfc/rfc7662
  @Post(path = "/v1/oauth2/token/introspect")
  this.introspectToken = async (req, res) => {

    if (!req.is('application/json') && !req.is('application/x-www-form-urlencoded')) {
      res.status(400);
      return res.json({
        code: 400001,
        message: "unsuported content type"
      });
    }

    try {
      var tokenInfo = await this.oauth2SpecService.introspectToken(req.body.token);
      res.status(200);
      tokenInfo.active = true;
      return res.json({
        code: 200000,
        message: "success",
        content: tokenInfo
      });
    } catch (e) {
      console.log(e);
      res.status(500);
      return res.json({
        code: 500410,
        message: "token is not active",
        content : {
          active: false
         }
      });
    }
  }

  @Post(path = "/v1/oauth2/token/microsoft-auth-code")
  this.generateTokenFromMicrosoftAuthCode = async (req, res) => {

    if (!req.is('application/json')) {
      res.status(400);
      return res.json({
        code: 400001,
        message: "unsuported content type"
      });
    }

    try {
      var tokenResponse = await this.oauth2SpecService.generateTokenFromMicrosoftAuthCode(req.body.code);
      res.status(200);
      return res.json(tokenResponse);
    } catch (e) {
      console.log(e);
      res.status(500);
      return res.json({
        code: 500000,
        message: "internal error"
      });
    }
  }


}

module.exports = Oauth2SpecRoutes;
