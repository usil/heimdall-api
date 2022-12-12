const Subject = require('../models/Subject');
const bcrypt = require('bcrypt');

@Service
function SubjectService() {

  this.saltRounds = 10;

  this.createUser = async (subject) => {
    const hashedValue = await bcrypt.hash(subject.password, this.saltRounds)
    let response = await Subject.create({ 
      identifier: subject.username, 
      secret: hashedValue, 
      role: subject.role,
      longLiveTokenUuid: subject.longLiveTokenUuid
    });
    return response;
  }

  this.createClient = async (subject) => {
    const hashedValue = await bcrypt.hash(subject.client_secret, this.saltRounds)
    let response = await Subject.create({ 
      identifier: subject.client_id, 
      secret: hashedValue, 
      role: subject.role,
      longLiveTokenUuid: subject.longLiveTokenUuid
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

  this.updateByIdentifier = async (identifier, role, secret) => {

    var hashedSecret;
    if(typeof secret !== 'undefined'){
      hashedSecret = await bcrypt.hash(subject.client_secret, this.saltRounds)
    }

    return await Subject.updateOne
    (
      {
        identifier : identifier
      },
      {
        $set :
        {
          role : role,
          secret : hashedSecret
        }
      }
    )
  }  

}

module.exports = SubjectService;