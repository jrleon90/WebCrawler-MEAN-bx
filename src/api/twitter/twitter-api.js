/*jshint esversion: 6 */

var express = require('express');
var Twitter = require('twitter');
var twitterRouter = express.Router;
var axios = require('axios');
require('dotenv').config();

var getTwitterCount = (query) => {
  var encodedQuery = encodeURIComponent(query);
  var twitterURL = `https://api.twitter.com/1.1/search/tweets.json?q=${query}`;
  var clientTw = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_TOKEN_SECRET,
    });

  var twitterPromise = new Promise(function (resolve, reject) {
      clientTw.get('users/search', { q: query }, function (error, tweets, response) {
          if (!error) {
            var twitterCount = 0;
            console.log('TW Data', tweets[2]);
            for (var i = 0; i < tweets.length; i++) {
              twitterCount += tweets[i].followers_count;
            }

            tweets.sort((a, b) => {
                return b.followers_count - a.followers_count;
              });

            var twitterObj = {
              twitterCount: twitterCount,
              sortTwData: tweets,
            };

            resolve(twitterObj);
          }
        });
    });

  return twitterPromise;
};

module.exports.getTwitterCount = getTwitterCount;
