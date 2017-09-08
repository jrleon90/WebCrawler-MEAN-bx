/*jshint esversion: 6 */

var express = require('express');
var elasticsearch = require('elasticsearch');
var axios = require('axios');
var https = require('https');
var request = require('request');
var bing = require('node-bing-api')({ accKey: process.env.BING_SEARCH_API_KEY });
var fs = require('fs');
require('dotenv').config();

var getBingSearch = (query) => {
  var bingSearchPromise = new Promise((resolve, reject) => {
    bing.web(query, {
      count: 50,
    }, (error, res, body) => {
      resolve(body.webPages.value);
    });
  });
  return bingSearchPromise;
};

module.exports.getBingSearch = getBingSearch;
