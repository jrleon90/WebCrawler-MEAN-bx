  /*jshint esversion: 6 */

var express = require('express');
var elasticsearch = require('elasticsearch');
var axios = require('axios');
var https = require('https');
var request = require('request');
var fs = require('fs');
require('dotenv').config();

var client = new elasticsearch.Client({
  hosts: [
    process.env.ELASTICSEARCH_URI,
    process.env.ELASTICSEARCH_URIREDIRECT,
  ],
  ssl: {
    ca: process.env.ELASTICSEARCH_CA,
  },
});

var getBingResult = (wordsArray, iterateCount) => {
  var bingPromise = new Promise((resolve, reject) => {
    var bingRes =  [];
    var client = new elasticsearch.Client({
      hosts: [
        process.env.ELASTICSEARCH_URI,
        process.env.ELASTICSEARCH_URIREDIRECT,
      ],
      ssl: {
        ca: process.env.ELASTICSEARCH_CA,
      },
    });
    var axiosInstance = axios.create();
    axiosInstance.defaults.headers.common['Ocp-Apim-Subscription-Key'] =
    process.env.BING_SEARCH_API_KEY;

    var indexArray = [];
    for (var i = 0; i < 3; i++) {
      console.log('look', wordsArray[i]);
      axios.get(`https://api.cognitive.microsoft.com/bing/v5.0/search?q=${wordsArray[i]}`)
          .then((getResponse) => {
            console.log('search', wordsArray[i]);
            client.indices.exists({
              index: wordsArray[i],
            }, (err, resp, status) => {
              if (resp === false) {
                client.indices.create({
                  index: wordsArray[i],
                }, (err, resp, status) => {
                  if (err) {
                    console.log(err);
                  }
                });
              }
            });
            iterateCount++;
            if (iterateCount === 3) {
              resolve('Complete');
            }

            //console.log('response', getResponse.data.webPages.value);
          }).catch((errorMessage) => {
            console.log('error', errorMessage);
          });
    }
  });
  return bingPromise;
};

var getIndexData = () => {

    var indexPromise = new Promise((resolve, reject) => {
      fs.readFile('./words.txt', (err, data) => {
        resolve(data.toString().split('\n'));
      });

      // client.indices.exists({
      //   index: 'examples',
      // }, (err, resp, status) => {
      //   console.log('response', resp);
      // });
    });
    return indexPromise;
  };

var indexExists = (data) => {
    console.log('enter', data);
    client.indices.exists({
      index: data,
    }, (err, resp, status) => {
      if (resp === false) {
        client.indices.create({
          index: data,
        }, (err, resp, status) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  };

module.exports.getIndexData = getIndexData;
module.exports.getBingResult = getBingResult;
