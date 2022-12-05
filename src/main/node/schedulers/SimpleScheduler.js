const schedule = require('node-schedule');
const moment = require('moment');
const HttpHelper = require('../common/HttpHelper');

@Service
function SimpleScheduler() {

  @Autowire(name = "pingService")
  this.pingService;

  this.httpHelper = new HttpHelper();

  this.scheduleSimplePing = async({ url, port, printResultShell = false, cronExpression }) => {
    schedule.scheduleJob(cronExpression, async () => {
      let date = moment()
  
      let statusCode = await this.httpHelper.performGetOperation(`${url.trim()}${port ? ':' + port.trim() : ''}`);
  
      const resultWeb = {
        webBaseUrl: url,
        timeString: date.format('h:mm:ss'),
        dateString: date.format('YYYY-MM-DD'),
        responseTimeMillis: moment() - date,
        responseCode: statusCode
      }
  
      let res = await this.pingService.registerPing(resultWeb)
      if(statusCode!=200 && printResultShell){
        console.log(`webBaseUrl: ${resultWeb.webBaseUrl}\tresponseCode: ${statusCode}\tresponseTimeMillis: ${resultWeb.responseTimeMillis}`)
      }
        
    });
  }

}  

module.exports = SimpleScheduler;
