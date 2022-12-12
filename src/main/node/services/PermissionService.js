const Permission = require('../models/Permission');

@Service
function PermissionService() {

  this.saltRounds = 10;

  this.hasPermissions = async (role, resource, action) => {
    var result = await Permission.find({ role: role, resource:resource, action:action });
    return result.length > 0;
  }

  this.findByRole = async (role) => {
    return await Permission.find({ role: role });
  }
  
  this.create = async (permission) => {
    let response = await Permission.create({ 
      role: permission.role, 
      resource: permission.resource, 
      action: permission.action
    });
    return response;
  }  

}

module.exports = PermissionService;