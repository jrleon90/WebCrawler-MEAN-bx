/*jshint esversion: 6 */

var express = require('express');
var graph = require('fbgraph');
var axios = require('axios');
var https = require('https');
require('dotenv').config();

var facebookFanCount = (urls, iterateCount) => {
    var fbFanCountPromise = new Promise((resolve, reject) => {
      fbCount = 0;
      fbData = [];
      for (var i in urls) {
        https.get(urls[i], (response) => {
          //fbCount = fbCount + response.data.fan_count;
          response.setEncoding('utf-8');
          response.on('data', (data) => {
            var dataJson = JSON.parse(data);
            fbData.push(dataJson);
            fbCount += dataJson.fan_count;
          });
          fbData.sort((a, b) => {
            return b.fan_count - a.fan_count;
          });
          iterateCount++;
          if (iterateCount === urls.length) {
            var fbObject = {
              fbCount: fbCount,
              fbData: fbData,
            };
            resolve(fbObject);
          }
        });
      }
    });
    return fbFanCountPromise;
  };

var getFacebookCount = (query) => {
  var facebookPromise = new Promise(function (resolve, reject)
  {
      graph.setAccessToken(process.env.FACEBOOK_API_KEY);
      graph.get('search', { q: query, type: 'page', limit: 20 }, function (err, response) {
          if (err) {
            reject(err);
          } else {
            var urls = [];
            for (var k in response.data) {
              urls.push(`https://graph.facebook.com/v2.10/${response.data[k].id}?access_token=${process.env.FACEBOOK_API_KEY}&fields=name,fan_count,link`);
            }

            resolve(urls);

          }

        });
    });

  return facebookPromise;
};

module.exports.getFacebookCount = getFacebookCount;
module.exports.facebookFanCount = facebookFanCount;
