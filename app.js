/*jshint esversion: 6 */

var express = require('express');
var app = express();
var Crawler = require('simplecrawler');
var nluRouter = require('./src/api/nlu');
var crawlerRouter = require('./src/api/crawler-2');
var bingRouter = require('./src/api/bing');

var port = process.env.PORT || 8080;
require('dotenv').config();

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/nlu', nluRouter);
app.use('/crawl', crawlerRouter);
app.use('/bing', bingRouter);

app.get('/', function (req, res) {res.render('index');});

app.get('/env', function (req, res) {
    if (process.env.VCAP_SERVICES) {
      var env = JSON.parse(process.env.VCAP_SERVICES);
      res.send(env['natural-language-understanding']);
    }else {
      res.send('Not Found Env');
    }});

app.listen(port, function (err) {
    if (err) {
      console.log(err);
    }

    console.log('Server running: ' + port);
});
