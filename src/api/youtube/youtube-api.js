/*jshint esversion: 6 */

var express = require('express');
var axios = require('axios');
var https = require('https');
var request = require('request');
var Youtube = require('youtube-node');
require('dotenv').config();

var ytclient = new Youtube();
ytclient.setKey(process.env.YOUTUBE_API_KEY);

var getYoutubeChannels = (query) => {
  var youtubePromise = new Promise((resolve, reject) => {
      ytclient.search(query, 20, (error, result) => {
          if (error) {
            console.log('error: ' + error);
            reject(error);
          }else {
            var ytUrls = [];
            var ytName = [];
            var ytObj = {};
            for (var i in result.items) {
              ytUrls.push(`https://www.googleapis.com/youtube/v3/channels?part=statistics%2Csnippet&id=${result.items[i].snippet.channelId}&key=${process.env.YOUTUBE_API_KEY}`);
              ytName.push(result.items[i].snippet.channelTitle);
            }
            ytObj.urls = ytUrls;
            ytObj.name = ytName;
            resolve(ytObj);
          }
        });
    });
  return youtubePromise;
};

var checkElementInArray = (array, element) => {
  if (array.length <= 0){
    return true;
  } else {
    for (var i in array) {
       if (array[i].items[0].id === element.items[0].id) {
         return false;
       }
    }
    return true;
  }
};

var getYouTubeStatistics = (ytObj, iterateCount) => {
  var youtubeStatsPromise = new Promise((resolve, reject) => {
    var ytCount = 0;
    var sortYT = [];

    for (var i in ytObj.urls) {
      request.get(ytObj.urls[i], (error, response, body) => {
        //fbCount = fbCount + response.data.fan_count;
        var bodyObj = JSON.parse(body);

        if (checkElementInArray(sortYT, bodyObj)){
        sortYT.push(bodyObj);
      }

          ytCount += parseInt(bodyObj.items[0].statistics.subscriberCount);

        sortYT.sort((a, b) => {
          return b.items[0].statistics.subscriberCount - a.items[0].statistics.subscriberCount;
        });
        iterateCount++;
        if (iterateCount === ytObj.urls.length) {
          var YTObject = { ytCount: ytCount,
                          ytSort: sortYT, };
          if (sortYT.length >= 5){
            resolve(YTObject);
          }else {
            reject('Not enough results');
          }
        }
      });
    }

  });
  return youtubeStatsPromise;
};

module.exports.getYoutubeChannels = getYoutubeChannels;
module.exports.getYouTubeStatistics = getYouTubeStatistics;
