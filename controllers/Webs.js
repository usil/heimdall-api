const Web = require('../models/Webs');
const Ping = require('./Ping');
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
    return `[WEB:ERROR_CREATE_WEB] ${err}`
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
    res.send(`[WEB:GET_WEBS] ${err}`)
  }
}

/**
 * Obtener el resultado de una web
 */
const getResultWeb = async (req, res) => {
  try {
    let { web, sinceDay } = await req.query;
    const dataWeb = await Web.find({ webBaseUrl: web })

    const resultsWebs = await Ping.getResultWebs(web, sinceDay);

    const statusWeb = {
      webBaseUrl: dataWeb[0].webBaseUrl,
      description: dataWeb[0].description,
      globalStatus: null,
      statusDetail: []
    }

    const statusDetail = {}

    const today = moment().format("YYYY-MM-DD");

    for (const resultWeb of resultsWebs) {
      statusDetail.dateString = null;
      statusDetail.averageResponseTimeMillis = 0;
      statusDetail.incidentsCount = 0;
      let count_status_ok = 0;

      for (const results of resultWeb) {
        statusDetail.dateString = results.dateString;

        if (dataWeb[0].expectResponseCode == results.responseCode) {
          count_status_ok++;
          statusDetail.averageResponseTimeMillis += results.responseTimeMillis;
        } else {
          statusDetail.incidentsCount++;
        }
      }
      statusDetail.averageResponseTimeMillis = statusDetail.averageResponseTimeMillis / count_status_ok;


      statusWeb.statusDetail.unshift({ ...{}, ...statusDetail })

      if (today === statusDetail.dateString && statusDetail.incidentsCount === 0) {
        statusWeb.globalStatus = 'Operational'
      }
    }
    res.send([statusWeb])
  } catch (err) {
    res.send(`[WEB:ERROR_GET_RESULT_WEB] ${err}`)
  }
}

/**
 * Obtener el resultado de todas las webs
 */
const getResultsWeb = async (req, res) => {
  try {
    let { sinceDay } = await req.query;
    const webs = await Web.find({});
    let resultsWeb = [];

    for (const web of webs) {
      let web_base_url = web.webBaseUrl;

      const resultDataWeb = await Ping.getResultWebs(web_base_url, sinceDay);
      const statusWeb = {
        webBaseUrl: web.webBaseUrl,
        description: web.description,
        globalStatus: null,
        statusDetail: []
      }

      const statusDetail = {}
      const today = moment().format("YYYY-MM-DD");

      for (const resultWeb of resultDataWeb) {
        statusDetail.dateString = null;
        statusDetail.averageResponseTimeMillis = 0;
        statusDetail.incidentsCount = 0;
        let count_status_ok = 0;

        for (const results of resultWeb) {
          statusDetail.dateString = results.dateString;

          if (web.expectResponseCode == results.responseCode) {
            count_status_ok++;
            statusDetail.averageResponseTimeMillis += results.responseTimeMillis;
          } else {
            statusDetail.incidentsCount++;
          }
        }
        statusDetail.averageResponseTimeMillis = Math.floor((statusDetail.averageResponseTimeMillis / count_status_ok))


        statusWeb.statusDetail.unshift({ ...{}, ...statusDetail })

        if (today === statusDetail.dateString) {
          statusWeb.globalStatus = 'Operational'
        }
      }

      resultsWeb.push(statusWeb)
    }

    res.send(resultsWeb)
  } catch (err) {
    res.send(`[WEB:ERROR_GET_RESULT_WEB] ${err}`)
  }
}


module.exports = {
  getWebs,
  createWeb,
  getResultWeb,
  getResultsWeb
}