const bcrypt = require('bcrypt');

@Route
function SubjectRoute(){

  @Autowire(name = "subjectService")
  this.subjectService;

  this.saltRounds = 10;
  
  @Protected(permission="subject:create")
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

  @Protected(permission="subject:update")
  @Put(path = "/v1/oauth2/subject")
  this.update = async(req, res) => {

    var alreadyExistUserResult = await this.subjectService.findByIdentifier(req.body.identifier);
    if(typeof alreadyExistUserResult === 'undefined' || alreadyExistUserResult.length == 0){
      return res.json({code:200404, message:"success"});
    }
   
    var updateResponse = await this.subjectService.updateByIdentifier({
      identifier:req.body.identifier,
      secret: req.body.secret,
      role:req.body.role
    });

    console.log(updateResponse)

    if(updateResponse){
      return res.json({code:200000, message:"success"});
    }else{
      return res.json({code:200409, message:"success"});
    }
    
  }
}

module.exports = SubjectRoute;