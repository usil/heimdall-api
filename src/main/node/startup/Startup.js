const mongoose = require("mongoose");

@ServerInitializer
function Startup() {

    @Autowire(name = "configuration")
    this.configuration;

    @Autowire(name = "websiteService")
    this.websiteService;

    @Autowire(name = "simpleScheduler")
    this.simpleScheduler;    

    this.onBeforeLoad = async() => {
        await this.configureDatabase();
        await this.registerWebsAndSchedule();
    }

    this.configureDatabase = async() => {
        let host = this.configuration.database.host;
        let user = this.configuration.database.user;
        let password = this.configuration.database.password;
        let port = this.configuration.database.port;
        let name = this.configuration.database.name;
        await mongoose.connect(`mongodb://${user}:${password}@${host}:${port}`, {
            dbName: name,
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        if(mongoose.connection.readyState!=1){
            throw new Error("An error ocurred while a connection to mongo was being validated");
        }else{
            console.log('MongoDB database connection established successfully');
        }
    }
    
    this.registerWebsAndSchedule = async() => {
        
        for (const web of this.configuration.websites) {
          const { url, expected_code, name, description, cronExpression } = web;
          let dataWeb = {
            webBaseUrl: url,
            name,
            description,
            expectResponseCode: expected_code
          }
          await this.websiteService.createWebIfDontExist(dataWeb)
          this.simpleScheduler.scheduleSimplePing({
            name,
            url,
            expected_code,
            printResultShell: true,
            cronExpression
          })
        }
    }


}

module.exports = Startup;