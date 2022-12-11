const bcrypt = require('bcrypt');

@Route
function SubjectRoute(){

  @Autowire(name = "subjectService")
  this.subjectService;

  this.saltRounds = 10;
  
  @Protected(permission="heimdall-api:subject:create")
  @Post(path = "/v1/oauth2/subject")
  this.create = async(req, res) => {

    const hashedSecret = await bcrypt.hash(req.body.secret, this.saltRounds)

    var creationResponse = await this.subjectService.createIfDontExist({
      identifier:req.body.identifier,
      secret: hashedSecret,
      role:req.body.role
    });

    if(creationResponse){
      return res.json({code:200000, message:"success"});
    }else{
      return res.json({code:200409, message:"success"});
    }
    
  }
}

module.exports = SubjectRoute;