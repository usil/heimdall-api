const Ping = require('../models/Ping')
const moment = require('moment');

/**
 * Obtener estatus de las webs
 */
const getResultWebs = async (web, sinceDay) => {
  let since_day = moment().subtract(sinceDay, 'd')

  try {
    const webResults = await Ping.find({
      webBaseUrl: web,
      dateString: {
        $gte: since_day.format('YYYY-MM-DD')
      }
    })
      .sort({
        webBaseUrl: 'asc',
        dateString: 'desc'
      });

    let resultAdapter = [];
    let dataAdapter = [];
    let dateString = null;
    let countResult = 0;
    
    for (const webResult of webResults) {
      countResult++;
      
      if (dateString !== webResult.dateString || webResults.length === countResult) {

        if (dataAdapter.length > 0 && webResults.length !== countResult) {
          resultAdapter.push(dataAdapter)
          dataAdapter = [];
        }

        dateString = webResult.dateString
      }

      if (webResults.length === countResult) {
        resultAdapter.push(dataAdapter)
      }

      dataAdapter.push(webResult)
    }

    return resultAdapter
  } catch (err) {
    return `[WEB:ERROR_GET_RESULT_WEBS] ${err}`;
  }
}

/**
 * Registrar estado del test
 */
const registerPing = async (webDataPing) => {
  try {
    const body = webDataPing;
    let response = await Ping.create(body);
    return response;
  } catch (err) {
    return "PING_WEB:ERROR_REGISTER_PING"
  }
}

module.exports = {
  getResultWebs,
  registerPing
}