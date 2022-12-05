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
        app.get("/v1/monitor/website", monitorRoute.findMonitorsByWebsiteAndStartDate)
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

});