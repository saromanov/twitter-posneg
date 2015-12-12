var app = app || {};

$(function(){
    'use strict';

    /*var socket = io();
      socket.on('connection', function() {
        console.log('Connected!');
      });
      
      socket.on('tweets', function(tweet, score) {

        if(score > 0) {
            var html = '<p class="bg-success">' + tweet + '</p>';
        } else {
             var html = '<p class="bg-danger">' + tweet + '</p>';
        }
        $('#tweet-container').append(html);
      });*/

        new app.ItemView();
});
