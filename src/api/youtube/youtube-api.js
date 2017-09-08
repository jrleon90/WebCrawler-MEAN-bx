/*jshint esversion: 6 */

var express = require('express');
var axios = require('axios');
var https = require('https');
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
            for (var i in result.items) {
              ytUrls.push(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${result.items[i].snippet.channelId}&key=${process.env.YOUTUBE_API_KEY}`);
            }

            resolve(ytUrls);
          }
        });
    });
  return youtubePromise;
};

var getYouTubeStatistics = (urls, iterateCount) => {
  var youtubeStatsPromise = new Promise((resolve, reject) => {
    var ytCount = 0;
    var sortYT = [];
    for (var i in urls) {
      https.get(urls[i], (response) => {
        //fbCount = fbCount + response.data.fan_count;
        response.setEncoding('utf-8');
        response.on('data', (data) => {
          var dataJson = JSON.parse(data);
          sortYT.push(dataJson);
          ytCount += parseInt(dataJson.items[0].statistics.subscriberCount);
        });

        sortYT.sort((a, b) => {
          return b.items[0].statistics.subscriberCount - a.items[0].statistics.subscriberCount;
        });
        iterateCount++;
        if (iterateCount === urls.length) {

          var YTObject = { ytCount: ytCount,
                          ytSort: sortYT, };
          resolve(YTObject);
        }
      });
    }
  });
  return youtubeStatsPromise;
};

module.exports.getYoutubeChannels = getYoutubeChannels;
module.exports.getYouTubeStatistics = getYouTubeStatistics;
