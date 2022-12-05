const PingModel = require('../models/Ping');
const moment = require('moment');

@Service
function PingService() {

  /**
   * Obtener estatus de las webs
   */
  this.getResultWebs = async (web, sinceDay) => {
    let since_day = moment().subtract(sinceDay, 'd')

    try {
      const webResults = await PingModel.find({
        webBaseUrl: web,
        dateString: {
          $gt: since_day.format('YYYY-MM-DD')
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
      console.error("Error while result data was being retrieved");
      console.error(err);
      throw err;
    }
  }

  /**
   * Registrar estado del test
   */
  this.registerPing = async (webDataPing) => {
    try {
      const body = webDataPing;
      let response = await PingModel.create(body);
      return response;
    } catch (err) {
      console.error("Error while ping data was being created");
      console.error(err);
      throw err;
    }
  }

}

module.exports = PingService;