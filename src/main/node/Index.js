const include = require('nodejs-require-enhancer');
const AdvancedLog = include('/src/main/node/common/AdvancedLog.js');
new AdvancedLog().config({
    logLevel: process.env.HEIMDALL_LOG_LEVEL
});
const RestApplicationStarter = require("nodeboot-rest-starter").RestApplicationStarter;

const restApplicationStarter = new RestApplicationStarter();
restApplicationStarter.run({
    callerDirectoryLocation: __dirname,
    entrypointRelativeLocation: "src/main/node/Index.js",
    configRelativeLocation: "src/main/resources/application.json"
});