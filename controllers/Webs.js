const Web = require('../models/Webs')
const Ping = require('./Ping')
const moment = require('moment');

/**
 * Registrar web para test
 */
const createWeb = async (dataWeb) => {
  try {
    const body = dataWeb;
    let response = await Web.create(body);
    return response;
  } catch (err) {
    return "WEB:ERROR_CREATE_WEB"
  }
}

/**
 * Obtener las webs registradas
 */
const getWebs = async (req, res) => {
  try {
    const data = await Web.find({});
    res.send({ data })
  } catch (err) {
    res.send(err)
  }
}

/**
 * Obtener el resultado de una web
 */
const getResultWeb = async (req, res) => {
  try {
    let { web, date } = await req.query;
    const dataWeb = await Web.find({ webBaseUrl: web })

    const resultsWebs = await Ping.getResultWebs(web, date);

    let statusWeb = {
      webBaseUrl: dataWeb[0].webBaseUrl,
      description: dataWeb[0].description
    }

    const statusDetail = {
      averageResponseTimeMillis: 0,
      incidentsCount: 0
    }

    let count_status_ok = 0;
    for (const resultWeb of resultsWebs) {
      statusDetail.dateString = resultWeb.dateString;

      if (dataWeb[0].expectResponseCode == resultWeb.responseCode) {
        count_status_ok++;
        statusDetail.averageResponseTimeMillis += resultWeb.responseTimeMillis;
      } else {
        statusDetail.incidentsCount++;
      }
    }
    
    statusDetail.averageResponseTimeMillis = statusDetail.averageResponseTimeMillis / count_status_ok;
    statusWeb.statusDetail = statusDetail

    res.send(statusWeb )
  } catch (err) {
    return "WEB:ERROR_GET_RESULT_WEB"
  }
}



module.exports = {
  getWebs,
  createWeb,
  getResultWeb
}