const fs = require("fs");
const path = require("path");

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
    console.log(req.body)
    var response = await this.oauth2SpecService.generateToken({
      "grant_type": "password",
      "username": req.body.username,
      "password": req.body.password
    });
    return res.send(response);
  }

}

module.exports = SinginRoute;