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
require('dotenv').config();

crawlerRoute.use(bodyParser.urlencoded({ extended: false }));
crawlerRoute.use(bodyParser.json());

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
              //console.log('YouTube: '+Object.getOwnPropertyNames(result));
              //console.log('YouTube: '+result.item);
              for(var k in result.items){
                  console.log('title: '+result.items[k].snippet.channelTitle);
              }
              resolve(result);
          }
      })
   });

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


    Promise.all([twitterPromise, youtubePromise]).then(function(result){
        console.log('Twitter done: '+result);
        var totalCount = 0;
        for(var i=0;i<result.length;i++){
            totalCount = totalCount+result[i];
        }
        console.log('Total: '+totalCount);
        res.render('result',{data:totalCount,word:word});
    })





});



module.exports = crawlerRoute;