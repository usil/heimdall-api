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

const WebService = require("../../../main/node/services/WebService.js");

describe('WebService', function () {
  it('should create the web', async () => {

    sinon.stub(WebModel, 'create').callsFake(function () { return { "foo": "bar" } });

    var webService = new WebService();
    var response = await webService.createWeb({});
    expect(response.foo).to.equal("bar");

    WebModel.create.restore();
  });

  it('should return the details of one web', async () => {


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

    sinon.stub(PingService, 'getResultWebs').callsFake(function () {
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
    });


    var webService = new WebService();
    var resp = await webService.getResultWeb("foo", "bar");
    expect(resp.length).to.equal(1);
    expect(resp[0].webBaseUrl).to.equal("https://aj-derteano.github.io");
    expect(resp[0].description).to.equal("Web de portafolio");
    expect(resp[0].globalStatus).to.equal("Operational");
    expect(resp[0].statusDetail.length).to.equal(1);
    expect(resp[0].statusDetail[0].dateString).to.equal("2022-12-02");
    expect(resp[0].statusDetail[0].averageResponseTimeMillis).to.equal(69);
    expect(resp[0].statusDetail[0].incidentsCount).to.equal(0);

    PingService.getResultWebs.restore();
    WebModel.find.restore();
  });

  it('should return of all the registered webs', async () => {

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

    sinon.stub(PingService, 'getResultWebs').callsFake((...args) => {
      if (args[0] == "https://aj-derteano.github.io") {

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
      } else if (args[0] == "acme.com") {
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

    });


    var webService = new WebService();
    var resp = await webService.getResultsWeb(90);

    console.log(JSON.stringify(resp));

    expect(resp.length).to.equal(2);
    expect(resp[0].webBaseUrl).to.equal("https://aj-derteano.github.io");
    expect(resp[0].description).to.equal("Web de portafolio");
    expect(resp[0].globalStatus).to.equal("Operational");
    expect(resp[0].statusDetail.length).to.equal(1);
    expect(resp[0].statusDetail[0].dateString).to.equal("2022-12-02");
    expect(resp[0].statusDetail[0].averageResponseTimeMillis).to.equal(69);
    expect(resp[0].statusDetail[0].incidentsCount).to.equal(0);

    expect(resp[1].webBaseUrl).to.equal("acme.com");
    expect(resp[1].description).to.equal("acme.com desc");
    expect(resp[1].globalStatus).to.equal("Operational");
    expect(resp[1].statusDetail.length).to.equal(1);
    expect(resp[1].statusDetail[0].dateString).to.equal("2022-12-02");
    expect(resp[1].statusDetail[0].averageResponseTimeMillis).to.equal(84);
    expect(resp[1].statusDetail[0].incidentsCount).to.equal(0);    

    PingService.getResultWebs.restore();
    WebModel.find.restore();
  });

});
