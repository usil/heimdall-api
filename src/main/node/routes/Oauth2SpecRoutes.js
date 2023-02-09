const escape = require('escape-html');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

@Route
function Oauth2SpecRoutes() {

  @Autowire(name = "oauth2SpecService")
  this.oauth2SpecService;

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
}

module.exports = Oauth2SpecRoutes;
