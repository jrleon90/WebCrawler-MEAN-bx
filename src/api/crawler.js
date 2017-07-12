/**
 * Created by jrleon90 on 5/28/17.
 */
var express = require('express');
var crawlerRoute = express.Router();
var bodyParser = require('body-parser');
var Crawler = require('simplecrawler');
var graph = require('fbgraph');
var youtube = require('youtube-node');
var Twitter = require('twitter');
var async = require('async');
var request = require('request-promise');
var http = require('http');
var https = require('https');
require('dotenv').config();

crawlerRoute.use(bodyParser.urlencoded({ extended: false }));
crawlerRoute.use(bodyParser.json());
var YouTubeQuery;

crawlerRoute.post('/', function(req,res){
    var word = req.body.searchTerm;
    var twitterInfo;
    var client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret:process.env.TWITTER_CONSUMER_SECRET,
        access_token_key:process.env.TWITTER_TOKEN_KEY,
        access_token_secret:process.env.TWITTER_TOKEN_SECRET
    });

   /* var facebookPromise = new Promise(function(resolve,reject)
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
              //TODO: Find way to wait for this callback
              /*for(var k in result.items){
                getYoutubeData(result.items[k].snippet.channelId,function(data){
                    setYoutubeData(data);
                });*/
              resolve(result);

              }
      })
   });

   var YouTubeDataPromise = new Promise(function(resolve,reject){
       console.log('Promise YT: '+YouTubeQuery);
   });

   function setYoutubeData(data)
   {
       YouTubeData.push(data);
   }

   var getYoutubeStatistics =  function getYoutubeData(arrayData)
   {
       console.log('Enter In here: '+Object.getOwnPropertyNames(arrayData));
       var Statistics;

       var YoutubestatiscticPromise = new Promise(function(resolve,reject){
               var req = https.get('https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' + arrayData[0].snippet.channelId + '&key=' + process.env.YOUTUBE_API_KEY, function(response) {
                  response.on('data',function(chunk){ Statistics += chunk; });
                  response.on('end',function(){resolve(Statistics)});
               });

       });
   return YoutubestatiscticPromise;
   };

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
          resolve('data');
      });
      return RenderView;
    };


    Promise.all([twitterPromise, youtubePromise]).then(function(result){
        var YouTubeStatistics = [];

            getYoutubeStatistics(result[1].items).then(function (data) {
                YouTubeStatistics.push(data);

                completePromise().then(function(dataPromise){
                   console.log('Return: '+dataPromise);
                    res.render(dataPromise,{data:YouTubeStatistics});

                });
            });
        
    });





});



module.exports = crawlerRoute;