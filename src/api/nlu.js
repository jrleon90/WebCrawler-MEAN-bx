/**
 * Created by jrleon90 on 5/25/17.
 */
var express = require('express');
var nluRouter = express.Router();
var bodyParser = require('body-parser');
const naturalLanguage = require('watson-developer-cloud/natural-language-understanding/v1');

const nlu = new naturalLanguage({
   username: '834cdc80-4e9e-46e1-acb4-e544d73e7a8e',
   password: '2UoVIccfmKKN',
   version_date: naturalLanguage.VERSION_DATE_2017_02_27
});

nluRouter.use(bodyParser.urlencoded({ extended: false }));
nluRouter.use(bodyParser.json());

nluRouter.post('/', function(req,res){
   var word = req.body.searchTerm;
   const options = {
       'url':'apple',
       'features':{
           'concepts':{
               'limit':5
           }
       }
   };
   nlu.analyze(options,function(err,response){
       if(err){
           res.send('Error: '+err);
       }
       console.log(response);
       res.send('Word is: '+ response);

   })
});











module.exports = nluRouter;
