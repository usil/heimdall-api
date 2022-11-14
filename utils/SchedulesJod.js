const schedule = require('node-schedule');
const moment = require('moment');
const { registerPing } = require('../controllers/Ping');
const { requestStatus } = require('./TestWeb');

const pingToUrl = async ({ url, port, cronExpression = "*/2 * * * * *", printResultShell = false }) => {
  schedule.scheduleJob(cronExpression, async () => {
    let date = moment()

    let statusCode = await requestStatus(`${url.trim()}${port ? ':' + port.trim() : ''}`);

    const resultWeb = {
      webBaseUrl: url,
      timeString: date.format('h:mm:ss'),
      dateString: date.format('YYYY-MM-DD'),
      responseTimeMillis: moment() - date,
      responseCode: statusCode
    }

    let res = await registerPing(resultWeb)
    
    if (printResultShell)
      console.log(`Status web:\n\twebBaseUrl: ${resultWeb.webBaseUrl}\n\tresponseCode: ${statusCode}\n\tresponseTimeMillis: ${resultWeb.responseTimeMillis}`)
  });
}

module.exports = {
  pingToUrl
}
