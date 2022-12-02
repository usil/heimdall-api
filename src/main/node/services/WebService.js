const Web = require('../models/Webs');
const PingService = require('./PingService');
const moment = require('moment');

@Service
function WebService() {

  /**
   * Registrar web para test
   */
  this.createWeb = async (dataWeb) => {
    const body = dataWeb;
    let response = await Web.create(body);
    return response;
  }

  /**
   * Obtener las webs registradas
   */
  this.getWebs = async () => {
    return await Web.find({});
  }

  /**
   * Obtener el resultado de una web
   */
  this.getResultWeb = async (web, sinceDay) => {
    try {
      
      const dataWeb = await Web.find({ webBaseUrl: web })

      const resultsWebs = await PingService.getResultWebs(web, sinceDay);

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

      return [statusWeb];
    } catch (err) {
      console.error("Error while web and results were beign merged");
      throw err;
    }
  }

  /**
   * Obtener el resultado de todas las webs
   */
  this.getResultsWeb = async (sinceDay) => {
    try {
      const webs = await Web.find({});
      let resultsWeb = [];

      for (const web of webs) {
        let web_base_url = web.webBaseUrl;

        const resultDataWeb = await PingService.getResultWebs(web_base_url, sinceDay);
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

      console.log(resultsWeb);
      return resultsWeb;
    } catch (err) {
      console.error("Error while web results being retrieved");
      throw err;
    }

  }

}

module.exports = WebService;