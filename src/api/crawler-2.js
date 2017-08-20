/*jshint esversion: 6 */

var express = require('express');
var crawlerRoute = express.Router();
var twitterApi = require('./twitter/twitter-api');
var facebookApi = require('./facebook/facebook-api');
var youtubeApi = require('./youtube/youtube-api');
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
                console.log('TT Count:', twitterResponse);
                facebookApi.getFacebookCount(word).then((facebookResponse) => {
                  facebookApi.facebookFanCount(facebookResponse, 0).then((countResponse) => {
                    console.log('FB Count:', countResponse);
                    youtubeApi.getYoutubeChannels(word).then((youtubeResult) => {
                      youtubeApi.getYouTubeStatistics(youtubeResult, 0).then((statsResponse) => {
                        console.log('YT Count:', statsResponse);
                        res.render('data', {
                          TTCount: twitterResponse,
                          FBCount: countResponse,
                          YTCount: statsResponse,
                          Query: word,
                        });
                      });
                    });
                  });
                });
              }).catch((errorMessage) => {
                console.log('Error', errorMessage);
              });

});

module.exports = crawlerRoute;
