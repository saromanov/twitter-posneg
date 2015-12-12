var mongoose = require('mongoose');
var path = require('path');
var Twitter = require('twitter');
var sentiment = require('sentiment');

mongoose.connect('mongodb://localhost/test');

var Tweet = mongoose.model('Tweet', {author: String, tweet: String});

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


// Show current stream
exports.getStream = function(req, res){
    var count = 0;
    client.stream('statuses/filter', {track: 'bad'}, function(stream) {
        res.send('Monitoring');
        stream.on('data', function(tweet) {
            if(tweet.lang === "en") {
                sentiment(tweet.text, function(err, result){
                    console.log(result.score);
                });
            }
        });
    });
};
