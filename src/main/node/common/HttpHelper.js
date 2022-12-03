const axios = require('axios');

function HttpHelper(){
  
  this.performGetOperation = async (url) => {
    try {
      let httpRequest = await axios({
        method: 'get',
        url
      })
      return httpRequest.status;
    } catch (err) {
      const { errno, code } = err;
      return code
    }
  }
}

module.exports = HttpHelper;