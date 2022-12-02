const axios = require('axios');

const requestStatus = async (url) => {
  try {
    let httpRequest = await axios({
      method: 'get',
      url
    })
    return httpRequest.status;
  } catch (err) {
    const { errno, code } = err;
    // console.log(code)
    return code
  }

}

module.exports = {
  requestStatus
}