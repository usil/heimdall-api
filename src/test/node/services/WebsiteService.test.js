var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var resolveOrigin = require.resolve
var requireOrigin = require
var sinon = require('sinon');
const NodeInternalModulesHook = require('meta-js').NodeInternalModulesHook;
NodeInternalModulesHook._compile();

const PingService = require('../../../main/node/services/PingService');
const WebModel = require('../../../main/node/models/Webs');

const WebsiteService = require("../../../main/node/services/WebsiteService.js");

describe('WebsiteService', function () {
    test('should create the web', async () => {

    sinon.stub(WebModel, 'create').callsFake(function () { return { "foo": "bar" } });

    var websiteService = new WebsiteService();
    var response = await websiteService.createWeb({});
    expect(response.foo).to.equal("bar");

    WebModel.create.restore();
  });

    test('should create the web if dont exist', async () => {

    sinon.stub(WebModel, 'create').callsFake(function () { return { "foo": "bar" } });

    sinon.stub(WebModel, 'find').callsFake(function () {
      return []
    });    

    var websiteService = new WebsiteService();
    var response = await websiteService.createWebIfDontExist({});
    expect(response.foo).to.equal("bar");

    WebModel.create.restore();
    WebModel.find.restore();
  });  

    test('should not create the web if dont exist', async () => {

    sinon.stub(WebModel, 'find').callsFake(function () {
      return [{}]
    });    

    var websiteService = new WebsiteService();
    var response = await websiteService.createWebIfDontExist({});
    expect(response).to.equal(undefined);

    WebModel.find.restore();
  });    

    test('should return the details of one web', async () => {


    sinon.stub(WebModel, 'find').callsFake(function () {
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
        }
      ]
    });

    function pingServiceMock() {
      this.getResultWebs = function () {
          return [
            [
              {
                _id: "638a67e8fec90ff686ccb583",
                webBaseUrl: 'https://aj-derteano.github.io',
                timeString: '9:02:32',
                dateString: '2022-12-02',
                responseTimeMillis: 76,
                responseCode: '200',
                deleted: false
              },
              {
                _id: "638a67eafec90ff686ccb589",
                webBaseUrl: 'https://aj-derteano.github.io',
                timeString: '9:02:34',
                dateString: '2022-12-02',
                responseTimeMillis: 53,
                responseCode: '200',
                deleted: false
              },
              {
                _id: "638a67ecfec90ff686ccb58f",
                webBaseUrl: 'https://aj-derteano.github.io',
                timeString: '9:02:36',
                dateString: '2022-12-02',
                responseTimeMillis: 78,
                responseCode: '200',
                deleted: false
              }]];
      }
  }    


    var websiteService = new WebsiteService();
    websiteService.pingService = new pingServiceMock();
    var resp = await websiteService.getResultWeb("foo", "bar");
    console.log(JSON.stringify(resp, null, 4));
    expect(resp.webBaseUrl).to.equal("https://aj-derteano.github.io");
    expect(resp.description).to.equal("Web de portafolio");
    //@TODO is operational only if date is today
    //expect(resp.globalStatus).to.equal("Operational");
    expect(resp.statusDetail.length).to.equal(1);
    expect(resp.statusDetail[0].dateString).to.equal("2022-12-02");
    expect(resp.statusDetail[0].averageResponseTimeMillis).to.equal(69);
    expect(resp.statusDetail[0].incidentsCount).to.equal(0);

    WebModel.find.restore();
  });

    test('should return of all the registered webs', async () => {

    sinon.stub(WebModel, 'find').callsFake(function () {
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
      ]
    });

    function pingServiceMock() {
      this.getResultWebs = function (website) {
        if (website == "https://aj-derteano.github.io") {

          return [
            [
              {
                _id: "638a67e8fec90ff686ccb583",
                webBaseUrl: 'https://aj-derteano.github.io',
                timeString: '9:02:32',
                dateString: '2022-12-02',
                responseTimeMillis: 76,
                responseCode: '200',
                deleted: false
              },
              {
                _id: "638a67eafec90ff686ccb589",
                webBaseUrl: 'https://aj-derteano.github.io',
                timeString: '9:02:34',
                dateString: '2022-12-02',
                responseTimeMillis: 53,
                responseCode: '200',
                deleted: false
              },
              {
                _id: "638a67ecfec90ff686ccb58f",
                webBaseUrl: 'https://aj-derteano.github.io',
                timeString: '9:02:36',
                dateString: '2022-12-02',
                responseTimeMillis: 78,
                responseCode: '200',
                deleted: false
              }]]
        } else if (website == "acme.com") {
          return [
            [
              {
                _id: "638a67e8fec90ff686ccb583",
                webBaseUrl: 'acme.com',
                timeString: '9:02:32',
                dateString: '2022-12-02',
                responseTimeMillis: 45,
                responseCode: '200',
                deleted: false
              },
              {
                _id: "638a67eafec90ff686ccb589",
                webBaseUrl: 'acme.com',
                timeString: '9:02:34',
                dateString: '2022-12-02',
                responseTimeMillis: 87,
                responseCode: '200',
                deleted: false
              },
              {
                _id: "638a67ecfec90ff686ccb58f",
                webBaseUrl: 'acme.com',
                timeString: '9:02:36',
                dateString: '2022-12-02',
                responseTimeMillis: 120,
                responseCode: '200',
                deleted: false
              }]]
        }
      }
  }  



    var websiteService = new WebsiteService();
    websiteService.pingService = new pingServiceMock();
    var resp = await websiteService.getResultsWeb(90);

    expect(resp.length).to.equal(2);
    expect(resp[0].webBaseUrl).to.equal("https://aj-derteano.github.io");
    expect(resp[0].description).to.equal("Web de portafolio");
    //@TODO is operational only if date is today
    //expect(resp[0].globalStatus).to.equal("Operational");
    expect(resp[0].statusDetail.length).to.equal(1);
    expect(resp[0].statusDetail[0].dateString).to.equal("2022-12-02");
    expect(resp[0].statusDetail[0].averageResponseTimeMillis).to.equal(69);
    expect(resp[0].statusDetail[0].incidentsCount).to.equal(0);

    expect(resp[1].webBaseUrl).to.equal("acme.com");
    expect(resp[1].description).to.equal("acme.com desc");
    //@TODO is operational only if date is today
    //expect(resp[1].globalStatus).to.equal("Operational");
    expect(resp[1].statusDetail.length).to.equal(1);
    expect(resp[1].statusDetail[0].dateString).to.equal("2022-12-02");
    expect(resp[1].statusDetail[0].averageResponseTimeMillis).to.equal(84);
    expect(resp[1].statusDetail[0].incidentsCount).to.equal(0);    

    WebModel.find.restore();
  });

});
