var express = require('express');
var http = require('http');
var routes = require('./routes/routes');
var morgan = require('morgan')
    bodyParser = require('body-parser')
    serveStatic = require('serve-static')
    socketio = require('socket.io')
    twitter = require('twitter')
    sentiment = require('sentiment');
    path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', './public');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serveStatic(path.join(__dirname, 'public')));

//io = io.listen(server);

app.get('/', function(req, res){
    res.render('index', {header: "Analytics from Twitter"});
});

app.get('/stream', routes.getStream);


var server = http.createServer(app);
server.listen('3000');
var io = socketio(server);
console.log("Start listening");


var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


io.on('connect', function(socket){
    var counters = {};
    socket.on('addhashtag', function(back){
        counters[back] = 0;
        client.stream('statuses/filter', {track: back}, function(stream) {
          stream.on('data', function(tweet) {
            if(tweet.lang === "en") {
                sentiment(tweet.text, function(err, result){
                    socket.emit('tweets', tweet.text, result.score);
                });
            }
        });

        stream.on('error', function(error) {
          throw error;
        });
    })

    });

});
