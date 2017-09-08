/*jshint esversion: 6 */

var express = require('express');
var crawlerRoute = express.Router();
var twitterApi = require('./twitter/twitter-api');
var facebookApi = require('./facebook/facebook-api');
var youtubeApi = require('./youtube/youtube-api');
var crawlApi = require('./crawl/crawl-api');
var elasticsearchApi = require('./elasticsearch/elasticsearch-api');
var bingApi = require('./bing-search/bing-api');
var bodyParser = require('body-parser');
var Crawler = require('simplecrawler');
var youtube = require('youtube-node');
require('dotenv').config();

crawlerRoute.use(bodyParser.urlencoded({ extended: false }));
crawlerRoute.use(bodyParser.json());
var YouTubeQuery = [];

crawlerRoute.post('/', function (req, res) {
  var word = req.body.searchTerm;
  twitterApi.getTwitterCount(word).then((twitterResponse) => {
                console.log('TT Count:', twitterResponse.twitterCount);
                facebookApi.getFacebookCount(word).then((facebookResponse) => {
                  facebookApi.facebookFanCount(facebookResponse, 0).then((countResponse) => {
                    console.log('FB Count:', countResponse.fbCount);
                    youtubeApi.getYoutubeChannels(word).then((youtubeResult) => {
                      youtubeApi.getYouTubeStatistics(youtubeResult, 0).then((statsResponse) => {
                        console.log('YT Count:', statsResponse.ytSort[0].items);
                        bingApi.getBingSearch(word).then((bingResponse) => {
                          //console.log('Bing:', bingResponse[1]);
                          res.render('data', {
                            TTCount: twitterResponse,
                            FBCount: countResponse,
                            YTCount: statsResponse,
                            bingSearch: bingResponse,
                            Query: word,
                          });
                        });
                      });
                    });
                  });
                });
              }).catch((errorMessage) => {
                console.log('Error', errorMessage);
              });

  // elasticsearchApi.getIndexData().then((elasticResult) => {
  //   elasticsearchApi.getBingResult(elasticResult, 0).then((bingResult) => {
  //     console.log('Bing', bingResult);
  //   });
  // }).catch((errorMessage) => {
  //   console.log('Error', errorMessage);
  // });
});

module.exports = crawlerRoute;
