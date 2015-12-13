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
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(serveStatic(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
    res.render('index', {
        header: "Twitter mood"
    });
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

var analytics = function() {
    this.count = 0;
    this.pos = 0;
    this.neg = 0;
};

analytics.prototype.getResult = function(score) {
    this.count += 1;
    if (score < 0) {
        this.neg += 1;
    } else if (score > 0) {
        this.pos += 1;
    }

    console.log(this.pos, this.neg);
    if (this.pos < this.neg) {
        return -1;
    } else if (this.pos > this.neg) {
        return 1;
    }

    return 0;
};

io.on('connect', function(socket) {
    var counters = {};
    var dup = {};
    var store = {};
    socket.on('addhashtag', function(back) {
        counters[back] = Object.keys(counters).length;
        store[back] = new analytics();
        client.stream('statuses/filter', {
            track: back
        }, function(stream) {
            stream.on('data', function(tweet) {
                if (tweet.lang === "en") {

                    if (!(tweet.text in dup)) {
                        dup[tweet.text] = 0;
                        var item = store[back];
                        sentiment(tweet.text, function(err, result) {
                            var pre = item.getResult(result.score);
                            socket.emit('tweets', tweet.text, pre, counters[back]);
                        });
                    }
                }
            });

            stream.on('error', function(error) {
                console.log(error);
                throw error;
            });
        })

    });

});
