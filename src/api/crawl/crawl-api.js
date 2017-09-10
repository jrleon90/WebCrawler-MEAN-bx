/*jshint esversion: 6 */

var express = require('express');
var axios = require('axios');
var https = require('https');
var Crawler = require('simplecrawler');
var cheerio = require('cheerio');
require('dotenv').config();

var startCrawl = (query) => {
  var startUrl = 'http://www.xataka.com';
  var myCrawler = new Crawler(startUrl);
  myCrawler.maxDepth = 1;
  myCrawler.on('fetchcomplete', (queueItem, responseBuffer, response) => {
    console.log('Crawl', Object.getOwnPropertyNames(response.complete));
  });

  myCrawler.start();
};

module.exports.startCrawl = startCrawl;
