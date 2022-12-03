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

const WebsiteRoute = require('$/src/main/node/routes/WebsiteRoute.js');

describe('WebsiteRoute', function () {

    it('findAll - should return all the websites', async function () {

        function websiteServiceMock() {
            this.getWebs = function () {
                return [
                    {
                        _id: "638a67e7fec90ff686ccb574",
                        webBaseUrl: 'https://aj-derteano.github.io',
                        name: 'porfolio',
                        description: 'Web de portafolio',
                        expectResponseCode: 200,
                        deleted: false,
                        createdAt: "2022-12-02T21:02:31.591Z",
                        updatedAt: "2022-12-02T21:02:31.591Z"
                    },
                    {
                        _id: "1f945928-27fc-4c32-b363-76327821d161",
                        webBaseUrl: 'acme.com',
                        name: 'acme.com name',
                        description: 'acme.com desc',
                        expectResponseCode: 200,
                        deleted: false,
                        createdAt: "2022-12-02T21:02:31.591Z",
                        updatedAt: "2022-12-02T21:02:31.591Z"
                    }
                ];
            }
        }

        var websiteRoute = new WebsiteRoute();
        websiteRoute.websiteService = new websiteServiceMock();

        const app = express();
        server = http.createServer(app);
        app.get("/v1/website", websiteRoute.findAll)
        server.listen(0); //i dont know why is sync
        const response = await request(app).get('/v1/website');

        expect(response.status).to.eql(200);
        var responseObject = JSON.parse(response.text);
        expect(responseObject.length).to.eql(2);
        expect(responseObject[0].webBaseUrl).to.eql("https://aj-derteano.github.io");
        expect(responseObject[1].webBaseUrl).to.eql("acme.com");
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