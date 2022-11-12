const schedule = require('node-schedule');
const moment = require('moment');
const { registerPing } = require('../controllers/Ping');
const { requestStatus } = require('./TestWeb');


const pingToUrl = ({ name, url, port, expectedCode, printResultShell = false }) => {
  schedule.scheduleJob('*/2 * * * * *', async () => {
    let date = moment()

    let statusCode = await requestStatus(`${url.trim()}${port ? ':' + port.trim() : ''}`);
    console.log(statusCode)
    const resultWeb = {
      webBaseUrl: url,
      timeString: date.format('h:mm:ss'),
      dateString: date.format('YYYY-MM-DD'),
      responseTimeMillis: moment() - date,
      responseCode: statusCode
    }

    let res = await registerPing(resultWeb)

    if (printResultShell)
      console.log({ ...res, ...resultWeb })
  });
}

module.exports = {
  pingToUrl
}