const ApiResponseCodes = require('$/src/main/node/common/ApiResponseCodes.js');

function HeimdallApiHelper(){
  
  this.getPermissionsByStringRoute = (rawDependencies) => {

    var permissionsByStringRoute = {};
    try {
      rawDependencies.filter((dependency)=> {
        if(dependency.meta.name !== "Route"){
          return;
        }
  
        var allowedMethods = ["Post", "Get", "Put", "Delete"];
        for(var functionName in dependency.functions){
          var functionAnnotations = dependency.functions[functionName];
          var protectedAnnotation = functionAnnotations.find(functionAnnotation => functionAnnotation.name === "Protected")
          if(typeof protectedAnnotation === 'undefined') continue;
          var routeAnnotation = functionAnnotations.find(functionAnnotation => allowedMethods.includes(functionAnnotation.name))
          if(typeof routeAnnotation === 'undefined') continue;    
          permissionsByStringRoute[routeAnnotation.arguments.path] = protectedAnnotation.arguments.permission;
        }
        
      });

      return permissionsByStringRoute;
    } catch (err) {
      err.code = ApiResponseCodes.internal_error.code;
      err.stack= "Error while permissions were being mapped by route"+"\n"+err.stack
      throw err;
    }
  }
}

module.exports = HeimdallApiHelper;