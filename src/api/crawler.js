/*jshint esversion: 6 */


var express = require('express');
var crawlerRoute = express.Router();
var bodyParser = require('body-parser');
var Crawler = require('simplecrawler');
var graph = require('fbgraph');
var youtube = require('youtube-node');
var Twitter = require('twitter');
var request = require('request-promise');
var http = require('http');
var https = require('https');
require('dotenv').config();

crawlerRoute.use(bodyParser.urlencoded({ extended: false }));
crawlerRoute.use(bodyParser.json());
var YouTubeQuery = [];

crawlerRoute.post('/', function (req, res) {
    var word = req.body.searchTerm;
    var twitterInfo;
    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_TOKEN_KEY,
        access_token_secret: process.env.TWITTER_TOKEN_SECRET,
      });

    /*var facebookPromise = new Promise(function(resolve,reject)
        {
            graph.setAccessToken(process.env.FACEBOOK_API_KEY);
            graph.get('search', {q: word, type: 'page', limit: 100}, function (err, response) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    console.log('Page 1:');

                    for (var k in response.data){
                        graph.get('page',{})
                        console.log(response.data[k].name);
                    }
                    resolve(response);

                }

            });
        });*/
var ytclient = new youtube();

       var youtubePromise = new Promise(function(resolve,reject){
           ytclient.setKey(process.env.YOUTUBE_API_KEY);
           ytclient.search(word,20,function(error,result){
              if(error){
                  console.log('error: '+error);
              }else{
                  resolve(result);
              }
          })
       });

   /* async function getYoutubeData(arrayData){

        for(let i=0;i<arrayData.length;i++) {
            https.get('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + arrayData[start].snippet.channelId + '&key=' + process.env.YOUTUBE_API_KEY, function (response) {
                response.on('data', function (chunk) {
                    YouTubeQuery.push(chunk);
                    console.log('Enter: ' + start);
                });
            });
        }

    }*/
async function getYoutubeData(arrayData,start){
     if (start >= arrayData.length) {
               resolve(YouTubeQuery);
           } else {
               https.get('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + arrayData[start].snippet.channelId + '&key=' + process.env.YOUTUBE_API_KEY, function (response) {
                   response.on('data', function (chunk) {
                       YouTubeQuery.push(chunk);
                       console.log('Enter: ' + start);
                       return getYoutubeData(arrayData, start + 1);
                   });
               });
           }
   }

   var twitterPromise = new Promise(function(resolve,reject){
       client.get('users/search', {q: word}, function (error, tweets, response) {
           if (!error) {
               var twitterCount = 0;
               for (var i=0;i<tweets.length;i++){
                   twitterCount = twitterCount+tweets[i].followers_count;
               }
               resolve(twitterCount);
           }
       });
   });

    var completePromise = function renderDataView()
    {
      var RenderView = new Promise(function(resolve,reject){
          console.log('Done');
          console.log('Array: '+YouTubeQuery);
          resolve('data');
      });
      return RenderView;
    };


    Promise.all([twitterPromise, youtubePromise]).then(async function(result){
        await getYoutubeData(result[1].items,0).then(function(stats){
            console.log('stats: '+stats);
            res.render('data');
        }).catch(function(error){
            console.log(error);
        });

    });





});



module.exports = crawlerRoute;
