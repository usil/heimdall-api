const WebModel = require('../models/Webs');
const moment = require('moment');

@Service
function WebsiteService() {

  @Autowire(name = "pingService")
  this.pingService;  

  /**
   * Registrar web para test
   */
  this.createWeb = async (dataWeb) => {
    const body = dataWeb;
    let response = await WebModel.create(body);
    return response;
  }

  /**
   * Registrar web para test
   */
   this.createWebIfDontExist = async (web) => {
    const foundWebs = await WebModel.find({ webBaseUrl: web.webBaseUrl })
    if(foundWebs.length==0){
      let response = await WebModel.create(web);
      return response;
    }    
  }  

  /**
   * Obtener las webs registradas
   */
  this.getWebs = async () => {
    return await WebModel.find({});
  }

  /**
   * Obtener el resultado de una web
   */
  this.getResultWeb = async (web, sinceDay) => {
    try {
      
      const dataWeb = await WebModel.find({ webBaseUrl: web })

      const resultsWebs = await this.pingService.getResultWebs(web, sinceDay);

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

      return statusWeb;
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
      const webs = await WebModel.find({});
      let resultsWeb = [];

      for (const web of webs) {
        let web_base_url = web.webBaseUrl;

        const resultDataWeb = await this.pingService.getResultWebs(web_base_url, sinceDay);
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

module.exports = WebsiteService;