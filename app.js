var express = require('express');
var app = express();
var Crawler = require('simplecrawler');

var port = process.env.PORT || 8080;

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function(req,res){
	res.render('index');
});

app.get('/env', function(req,res){

    if (process.env.VCAP_SERVICES) {
        var env = JSON.parse (process.env.VCAP_SERVICES);
        res.send(env["natural-language-understanding"]);
    }else{
        res.send('Not Found Env')
    }


});

app.listen(port, function(err){
    if (err){
        console.log(err);
    }
    console.log('Server running: '+port);
});
