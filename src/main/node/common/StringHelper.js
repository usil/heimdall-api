function StringHelper() {

}

StringHelper.replaceValuesInString = (string, obj) => {
  var s = string;
  for (var prop in obj) {
      s = s.replace(new RegExp('{' + prop + '}', 'g'), obj[prop]);
  }
  return s;
}

module.exports = StringHelper;
