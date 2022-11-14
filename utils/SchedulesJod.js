const schedule = require('node-schedule');
const moment = require('moment');
const { registerPing } = require('../controllers/Ping');
const { requestStatus } = require('./TestWeb');

const cronExpresion = process.env.cron_expression

const getRandomIntMax = (min, max) => Math.floor(Math.random() * (max - min) + min);

const pingToUrl = async ({ name, url, port, expectedCode, printResultShell = false }) => {
  // Datos de prueba
  /* for (let index = 0; index <= 90; index++) {

    let date = moment().subtract(index, 'd')
    console.log(date)
    let statusCode = await requestStatus(`${url.trim()}${port ? ':' + port.trim() : ''}`);
    const resultWeb = {
      webBaseUrl: url,
      timeString: date.format('h:mm:ss'),
      dateString: date.format('YYYY-MM-DD'),
      responseTimeMillis: moment() - date,
      responseCode: statusCode
    }

    let res = await registerPing(resultWeb)
  } */
  schedule.scheduleJob("*/2 * * * * *", async () => {
    let date = moment()

    let statusCode = await requestStatus(`${url.trim()}${port ? ':' + port.trim() : ''}`);
    console.log('12 SchedulesJod', statusCode)
    const resultWeb = {
      webBaseUrl: url,
      timeString: date.format('h:mm:ss'),
      dateString: date.format('YYYY-MM-DD'),
      responseTimeMillis: moment() - date,
      responseCode: getRandomIntMax(0, 10) > 0 ? statusCode : 500
    }

    let res = await registerPing(resultWeb)

    if (printResultShell)
      console.log({ ...res, ...resultWeb })
  });
}

module.exports = {
  pingToUrl
}
