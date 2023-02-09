const mongoose = require("mongoose");

@ServerInitializer
  function Startup() {

  @Autowire(name = "configuration")
  this.configuration;

  @Autowire(name = "websiteService")
  this.websiteService;

  @Autowire(name = "simpleScheduler")
  this.simpleScheduler;

  @Autowire(name = "express")
  this.express;

  @Autowire(name = "securityMiddleware")
  this.securityMiddleware;

  @Autowire(name = "rawDependencies")
  this.rawDependencies;

  @Autowire(name = "subjectService")
  this.subjectService;

  @Autowire(name = "permissionService")
  this.permissionService;

  this.onBeforeLoad = async () => {
    this.registerOauth2Middleware();
    await this.configureDatabase();
    await this.createDefaultAdmin();
    await this.registerWebsAndSchedule();
  }

  this.registerOauth2Middleware = async () => {
    this.securityMiddleware.configure();
  }

  this.configureDatabase = async () => {
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
    if (mongoose.connection.readyState != 1) {
      throw new Error("An error ocurred while a connection to mongo was being validated");
    } else {
      console.log('MongoDB database connection established successfully');
    }
  }

  this.createDefaultAdmin = async () => {
    var adminClientResult = await this.subjectService.findByIdentifier(this.configuration.oauth2.defaultAdminUser);
    if (typeof adminClientResult !== 'undefined' && adminClientResult.length > 0) {
      console.log("initial admin already exist")
    } else {
      //#TODO: validate if there is at least other admin
      //#TODO: validate not null
      await this.subjectService.createUser({
        username: this.configuration.oauth2.defaultAdminUser,
        password: this.configuration.oauth2.defaultAdminPassword,
        role: "admin"
      });
      console.log("initial admin client was created")
    }

    var adminRoleSearchResult = await this.permissionService.findByRole("admin");
    if (typeof adminRoleSearchResult !== 'undefined' && adminRoleSearchResult.length > 0) {
      console.log("admin role already exist")
      return;
    }
    //#TODO: validate if admin has the default or expected resources and actions
    var resource = "heimdall-api"
    await this.permissionService.create({
      role: "admin",
      resource: resource + ":subject",
      action: "create"
    });
    await this.permissionService.create({
      role: "admin",
      resource: resource + ":subject",
      action: "update"
    });
    console.log("at least one admin role exist")    
  }

  this.registerWebsAndSchedule = async () => {

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