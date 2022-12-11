const Permission = require('../models/Permission');
const bcrypt = require('bcrypt');

@Service
function PermissionService() {

  this.saltRounds = 10;

  this.hasPermissions = async (role, resource, action) => {
    var result = await Permission.find({ role: role, resource:resource, action:action });
    return result.length > 0;
  }

}

module.exports = PermissionService;