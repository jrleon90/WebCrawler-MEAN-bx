/**
 * Created by jrleon90 on 5/28/17.
 */
var express = require('express');
var crawlerRoute = express.Router();
var bodyParser = require('body-parser');
var Crawler = require('simplecrawler');
var graph = require('fbgraph');
var Twitter = require('twitter');
var async = require('async');
var request = require('request-promise');

crawlerRoute.use(bodyParser.urlencoded({ extended: false }));
crawlerRoute.use(bodyParser.json());

crawlerRoute.post('/', function(req,res){
    var word = req.body.searchTerm;
    var twitterInfo;
    var client = new Twitter({
        consumer_key:'8vFlNpOiV1KZv8v4bcy1Wvg9T',
        consumer_secret:'40HEq3om56jp42xsRtRJBiMJ8mVdJ3S07NuSheyWRlbwPX7aKr',
        access_token_key:'50516954-EzzQPKOcxGnFSiCQBW6BfGPUaduRsFrfqoFAwfF4x',
        access_token_secret:'ycecagTmQy75uAMyocShCnXesopEnY8A4T7ZNXTcNEVQd'
    });
   /* graph.setAccessToken('EAACW5Fg5N2IBAMVtHkejTM1UHAR1aFp5ql5gZBDhGo70wc1ZB6zOvNffFVM8U1J10SluakUEYJD6zYw6ZBzF98cJFjUUSOyvFKGMVZCZB5Op0KeSOmBJiX9md2fceTMwttKuGN6w4EGvyhSdZAA13BMQSOZAgnYD1ZC5KTLY842gMZAjEPcTs0gwguredVGdV6poZD');
    graph.get('search',{q:word,type:'group',limit:100},function(err,response){
       if(err){
           console.log('Error: '+err);
       }else{
           console.log('Page 1:');
           console.log(response);
           var jsonVar = json_decode(html_entity_decode(response),true);
           res.render('result',{data:jsonVar});

           }

    });*/

   var twitterPromise = new Promise(function(resolve,reject){
       client.get('users/search', {q: word}, function (error, tweets, response) {
           if (!error) {
               console.log('Twitter complete');
               var twitterCount = 0;
               for (var i=0;i<tweets.length;i++){
                   twitterCount = twitterCount+tweets[i].followers_count;
               }
               resolve(twitterCount);
           }
       });
   });


    Promise.all([twitterPromise]).then(function(result){
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