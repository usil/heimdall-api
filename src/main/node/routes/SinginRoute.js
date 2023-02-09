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

  @Get(path = "/v1/sing-in/url-details")
  this.getSignInUrlDetails = (req, res) => {

    var signInEngine = this.configuration.getProperty("login.engine")

    return res.send({
      code:200000,
      message:"success",
      content: {
        "engine": signInEngine,
        "url": "/v1/sing-in/default"
      }
    });
  }

  @Get(path = "/v1/sing-in/default")
  this.getDefaultLogin = async(req, res) => {

    if(typeof this.loginPageHtml === 'undefined'){
      this.loginPageHtml = await fs.promises.readFile(this.loginPageHtmlLocation, 'utf8' );
    };

    res.type("text/html")
    return res.send(this.loginPageHtml);
  }

  @Post(path = "/v1/sing-in/default")
  this.processDefaultLogin = async(req, res) => {
    var response = await this.oauth2SpecService.generateToken({
      "grant_type": "password",
      "username": req.body.username,
      "password": req.body.password
    });
    //#TODO: redirectWebBaseurl validate at startup
    
    var redirectWebBaseurl = this.configuration.getProperty("login.default.redirectWebBaseurl");

    if(typeof redirectWebBaseurl === 'undefined'){
      return res.status(500).send(`error_code = ${ApiResponseCodes.default_login_error_missing_redirect.code}`);
    }else if(response.code!=200000){
      return res.redirect(`${redirectWebBaseurl}?error_code=${response.code}`);
    }else{
      return res.redirect(`${redirectWebBaseurl}?access_token=${response.content.access_token}`);
    }
  }

}

module.exports = SinginRoute;