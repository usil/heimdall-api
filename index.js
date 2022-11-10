require('dotenv').config()
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
// process.env.TZ

const dbConnectMongo = require('./config/mongo');
// const { pingToUrl } = require('./utils/ScheduleJods');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(express.json());

app.use('/', require('./routes'))

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Exposed port http://127.0.0.1:${port}`)
});

dbConnectMongo();

/**
 * Ping to web for test
 */
// pingToUrl('https://aj-derteano.github/')
// pingToUrl('https://aj-derteano.github.io/', null, true)

