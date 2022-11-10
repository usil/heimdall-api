const schedule = require('node-schedule');
const moment = require('moment');
const { createStatusWeb } = require('../controllers/StatusWeb');
const { requestStatus } = require('./TestWeb');


const pingToUrl = (url, port, printResultShell = false) => {
  schedule.scheduleJob('*/2 * * * * *', async () => {
    let date = moment()

    let statusCode = await requestStatus(`${url.trim()}${port ? ':' + port.trim() : ''}`);
    console.log(statusCode)
    const resultWeb = {
      webBaseUrl: url,
      expectResponseCode: null,
      resultTest: {
        timeString: date.format('h:mm:ss'),
        dateString: date.format('YYYY-MM-DD'),
        responseTimeMillis: moment() - date,
        responseCode: statusCode
      }
    }

    let res = await createStatusWeb(resultWeb)

    if (printResultShell)
      console.log({ ...res, ...resultWeb })
  });
}

module.exports = {
  pingToUrl
}