require('nodejs-require-enhancer');
const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var resolveOrigin = require.resolve
var requireOrigin = require
var sinon = require('sinon');
const express = require('express');
const request = require('supertest');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const MonitorRoute = require('$/src/main/node/routes/MonitorRoute.js');

describe('MonitorRoute', function () {

    it('findAll - should return monitor data of all services', async function () {

        function websiteServiceMock() {
            this.getResultWeb = function () {

                return {
                    webBaseUrl: "https://aj-derteano.github.io",
                    description: "Web de portafolio",
                    globalStatus: "Operational",
                    statusDetail: [
                        {
                            "dateString": "2022-12-02",
                            "averageResponseTimeMillis": 60.5,
                            "incidentsCount": 0
                        }
                    ]
                };
            }
        }

        var monitorRoute = new MonitorRoute();
        monitorRoute.websiteService = new websiteServiceMock();

        const app = express();
        server = http.createServer(app);
        app.get("/v1/monitor/website", monitorRoute.findWebsiteDataMonitor)
        server.listen(0); //i dont know why is sync
        const response = await request(app).get('/v1/monitor/website?sinceDay=90&website=https://aj-derteano.github.io');

        expect(response.status).to.eql(200);
        var responseObject = JSON.parse(response.text);
        expect(responseObject.webBaseUrl).to.eql("https://aj-derteano.github.io");
        expect(responseObject.description).to.eql("Web de portafolio");
        expect(responseObject.globalStatus).to.eql("Operational");
        expect(responseObject.statusDetail.length).to.eql(1);
        expect(responseObject.statusDetail[0].dateString).to.eql("2022-12-02");
        expect(responseObject.statusDetail[0].averageResponseTimeMillis).to.eql(60.5);
        expect(responseObject.statusDetail[0].incidentsCount).to.eql(0);
    });

    /*it('should return 500001 if yaml is not sent', async function() {

        function devopsSettingsServiceMock() {
            this.createDevopsSettings = function() {
                return [666];
            }
        }

        var devops = new Devops();
        devops.devopsSettingsService = new devopsSettingsServiceMock();

        const app = express();
        server = http.createServer(app);
        app.post("/v1/devops/settings/variables", devops.createDevopsSettingsAndVariables)
        server.listen(0); //i dont know why is sync
        const response = await request(app).post('/v1/devops/settings/variables?repositoryName=acme&branchFilter=*&mailsToNotify=foo@bar.com');

        expect(response.status).to.eql(500);
        var responseObject = JSON.parse(response.text);
        expect(responseObject.code).to.eql(ApiResponseCodes.missing_yaml);

    });


    it('should return the expected json', async function() {

        function databaseConnectorMock() {
            function knexCore() {
                this.insert = () => {
                    return [666];
                }
            }

            this.transaction = () => {}
            this.rollback = () => {}
            this.commit = () => {}

            return new knexCore();
        }

        function devopsSettingsServiceMock() {
            this.createDevopsSettings = function() {
                return [666];
            }
        }

        function devopsVariablesServiceMock() {
            this.createVariable = function() {
                return 667;
            }
        }

        var devops = new Devops();
        devops.devopsSettingsService = new devopsSettingsServiceMock();
        devops.devopsVariablesService = new devopsVariablesServiceMock();        

        const yaml = await fs.readFile(path.join(__dirname, "sample.yaml"), 'utf8');

        const app = express();
        var multiParserMiddleware = new MultiParserMiddleware();
        app.use(multiParserMiddleware.parser());
        server = http.createServer(app);
        app.post("/v1/devops/settings/variables", devops.createDevopsSettingsAndVariables)
        server.listen(0); //i dont know why is sync

        const response = await request(app)
            .post('/v1/devops/settings/variables?repositoryName=acme&branchFilter=*&mailsToNotify=foo@bar.com')
            .set('Content-type', 'text/yaml')
            .send(yaml);

        expect(response.status).to.eql(200);

        var responseObject = JSON.parse(response.text);
        expect(responseObject.code).to.eql(200000);
        expect(responseObject.content.variablesIds.length).to.eql(4);
        expect(responseObject.content.variablesIds[0]).to.eql(667);
        expect(responseObject.content.variablesIds[1]).to.eql(667);

    });*/
});