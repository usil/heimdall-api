const StatusWeb = require('../models/StatusWeb')

/**
 * Obtener estatus de las webs
 */
const getStatusWebs = async (req, res) => {
  try {
    const data = await StatusWeb.find({});
    res.send({ data })
  } catch (err) {
    res.send("STATUS_WEB:ERROR_STATUS_WEBS")
  }
}

const getWebs = async (req, res) => {
  try {
    const data = await StatusWeb.distinct('webBaseUrl')
    res.send({ data })
  } catch (err) {
    res.send(`[WEBS:GET_WEBS]\n${err}`)
  }
}

/**
 * Obtener el resultado de una sola web
 */
const getStatusWeb = async (req, res) => {
  try {
    const data = await StatusWeb.find({ webBaseUrl: req.url });
    res.send({ data })
  } catch (err) {
    res.send("STATUS_WEB:ERROR_STATUS_WEB")
  }
}

/**
 * Registrar estado del test
 */
const createStatusWeb = async (webDataPing) => {
  try {
    const body = webDataPing
    let response = await StatusWeb.create(body);
    return response;
  } catch (err) {
    return "STATUS_WEB:ERROR_CREATE_STATUS"
  }
}

module.exports = {
  getWebs,
  getStatusWeb,
  createStatusWeb
}