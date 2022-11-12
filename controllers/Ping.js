const Ping = require('../models/Ping')

/**
 * Obtener estatus de las webs
 */
const getResultWebs = async (web, date) => {
  try {
    const webResults = await Ping.find(
      { webBaseUrl: web, dateString: date }
    );
    return webResults
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