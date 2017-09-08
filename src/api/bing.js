/*jshint esversion: 6 */

var express = require('express');
var bingRoute = express.Router();
var twitterApi = require('./twitter/twitter-api');
var facebookApi = require('./facebook/facebook-api');
var youtubeApi = require('./youtube/youtube-api');
var crawlApi = require('./crawl/crawl-api');
var elasticsearchApi = require('./elasticsearch/elasticsearch-api');
var bodyParser = require('body-parser');
var Crawler = require('simplecrawler');
var youtube = require('youtube-node');
require('dotenv').config();

bingRoute.use(bodyParser.urlencoded({ extended: false }));
bingRoute.use(bodyParser.json());
var YouTubeQuery = [];

bingRoute.get('/', function (req, res) {
  elasticsearchApi.getIndexData().then((elasticResult) => {
    elasticsearchApi.getBingResult(elasticResult, 0).then((bingResult) => {
      console.log('Bing', bingResult);
      res.render('result', { bingResult: bingResult });
    });
  }).catch((errorMessage) => {
    console.log('Error', errorMessage);
  });
});

module.exports = bingRoute;
