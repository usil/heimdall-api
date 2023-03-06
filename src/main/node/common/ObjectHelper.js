function ObjectHelper() {

}

ObjectHelper.hasProperty = function(obj, key) {
  // Get property array from key string
   var properties = key.split(".");

   // Iterate through properties, returning undefined if object is null or property doesn't exist
   for (var i = 0; i < properties.length; i++) {
     if (!obj || !obj.hasOwnProperty(properties[i])) {
       return false;
     }
     obj = obj[properties[i]];
   }
   // Nested property found, so return the value
   return (typeof obj !== "undefined" && obj != null) ;
};

ObjectHelper.getProperty = (key, obj) => {
  try {
      return key.split(".").reduce((result, key) => {
          return result[key]
      }, obj);
  } catch (err) {
      console.log(key + " cannot be retrieved from configuration")
  }
}

module.exports = ObjectHelper;
