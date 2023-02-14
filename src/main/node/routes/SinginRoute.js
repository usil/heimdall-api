const include = require('nodejs-require-enhancer');
const fs = require("fs");
const path = require("path");
const ApiResponseCodes = include('/src/main/node/common/ApiResponseCodes.js');

@Route
function SinginRoute(){

  @Autowire(name = "configuration")
  this.configuration;

  @Autowire(name = "oauth2SpecService")
  this.oauth2SpecService;

  this.loginPageHtmlLocation = path.join(process.env.npm_config_local_prefix, "src", "main", "resources", "default_login", "material.html");
  
  this.loginPageHtml;

  @Get(path = "/v1/sing-in/default")
  this.getDefaultLogin = async(req, res) => {

    if(typeof this.loginPageHtml === 'undefined'){
      this.loginPageHtml = await fs.promises.readFile(this.loginPageHtmlLocation, 'utf8' );
      this.loginPageHtml = this.loginPageHtml.replace(/@title@/g, this.configuration.getProperty("title") || "Heimdall Monitor");
      this.loginPageHtml = this.loginPageHtml.replace(/@loginHeaderColor@/g,
      this.configuration.getProperty("login.default.loginHeaderColor")|| "#009485");
      
    };
    var html = this.loginPageHtml.replace("@login_message@","");
    res.type("text/html")
    return res.send(html);
  }

  @Post(path = "/v1/sing-in/default")
  this.processDefaultLogin = async(req, res) => {
    var response = await this.oauth2SpecService.generateToken({
      "grant_type": "password",
      "username": req.body.username,
      "password": req.body.password
    });
    //#TODO: redirectWebBaseurl validate at startup
    
    var signInEngine = this.configuration.getProperty("login.engine")
    var redirectWebBaseurl = this.configuration.getProperty(`login.${signInEngine}.redirectWebBaseurl`);
    var errorCode;
    if(typeof redirectWebBaseurl === 'undefined'){
      console.error(ApiResponseCodes.default_login_error_missing_redirect);
      errorCode = ApiResponseCodes.default_login_error_missing_redirect.code;
    }else if(response.code!=200000){
      console.error(response);
      errorCode =  response.code;
    }

    if(typeof this.loginPageHtml === 'undefined'){
      this.loginPageHtml = await fs.promises.readFile(this.loginPageHtmlLocation, 'utf8' );
      this.loginPageHtml = this.loginPageHtml.replace(/@title@/g, this.configuration.getProperty("title") || "Heimdall Monitor");
      this.loginPageHtml = this.loginPageHtml.replace(/@loginHeaderColor@/g,
      this.configuration.getProperty("login.default.loginHeaderColor")|| "#009485");
      
    };

    if(typeof errorCode !== 'undefined'){
      var html = this.loginPageHtml.replace("@login_message@",`Contact system administrator, Error Code: ${errorCode}`);
      res.type("text/html")
      return res.status(500).send(html);
    }else{
      return res.redirect(`${redirectWebBaseurl}/default/callback?access_token=${response.content.access_token}`);
    }
   
  }

}

module.exports = SinginRoute;