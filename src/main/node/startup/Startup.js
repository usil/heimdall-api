const mongoose = require("mongoose");
const WebService = require('./services/WebService')

@ServerInitializer
function Startup() {

    @Autowire(name = "configuration")
    this.configuration;

    this.onBeforeLoad = async() => {
        await this.configureDatabase();
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
    
    this.registerWebs = async() => {
        
        for (const web of config.url_webs) {
          const { url, expected_code, name, description } = web;
          let dataWeb = {
            webBaseUrl: url,
            name,
            description,
            expectResponseCode: expected_code
          }
          Webs.createWeb(dataWeb)
        }
    }


}

module.exports = Startup;