const Subject = require('../models/Subject');
const bcrypt = require('bcrypt');

@Service
function SubjectService() {

  this.saltRounds = 10;

  this.createUser = async (subject) => {
    const hashedValue = await bcrypt.hash(req.body.password, this.saltRounds)
    let response = await Subject.create({ 
      identifier: req.body.username, 
      secret: hashedValue, 
      role: req.body.role,
      longLiveTokenUuid: req.body.longLiveTokenUuid
    });
    return response;
  }

  this.createClient = async (subject) => {
    const hashedValue = await bcrypt.hash(req.body.client_secret, this.saltRounds)
    let response = await Subject.create({ 
      identifier: req.body.client_secret, 
      secret: hashedValue, 
      role: req.body.role,
      longLiveTokenUuid: req.body.longLiveTokenUuid
    });
    return response;
  }  


  this.createIfDontExist = async (subject) => {
    const foundItems = await Subject.find({ identifier: subject.identifier })
    if (foundItems.length == 0) {
      let response = await Subject.create(subject);
      return true;
    } else {
      return false;
    }
  }

  //#TODO: add delete feature

  this.findByIdentifier = async (identifier) => {
    return await Subject.find({ identifier: identifier });
  }

}

module.exports = SubjectService;