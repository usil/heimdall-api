var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var moment = require('moment');

app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

app.get('/data', function(req, res) {
  res.json(getData());
});

function getData(){
  var targetServices = [];

  var today = new Date();

  for(var i=0; i < 5; i++) {

    var firstDay = new Date();
    firstDay.setDate(firstDay.getDate()-89);

    var serviceDetail = {
      label: randomWord(5)+".com",
      globalStatus: "Operational",
      description: randomWord(25)
    }

    var statusDetail = [];
    for(var j=0; j < 90; j++) {
      var dayDetail = {
        dateString: moment(firstDay).format('YYYY-MM-DD'),
        averageResponseTimeMillis: randomIntFromInterval(1,1000)
      }

      if(randomBoolean()){
        dayDetail.incidentsCount = randomIntFromInterval(1,20);
      }else{
        dayDetail.incidentsCount = 0;
      }

      statusDetail.push(dayDetail);
      firstDay.setDate(firstDay.getDate() + 1);
    }
    serviceDetail.statusDetail = statusDetail;
    targetServices.push(serviceDetail);
  }

  return targetServices;
}

function randomWord(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function randomBoolean() {
  return Math.random() < 0.5;
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

app.listen(process.env.PORT || 8081);
