var app = app || {};


(function($) {
    'use strict';

    app.ItemView = Backbone.View.extend({
        el: $('body'),

        events: {
            'click button#add': 'showItem',
        },
        initialize: function() {
            _.bindAll(this, 'render', 'showItem');
            this.collection = new app.ListItem();
            this.counter = 1;
            this.$input = this.$('.input-item');
            this.render();
        },

        render: function() {
            $('#inp').append("<button type='button' id = 'add' class='btn btn-primary btn-lg'>Add to track </button>");
        },

        showItem: function() {
            var socket = io();
            socket.on('connection', function() {
                console.log('Connected!');
            });

            socket.on('tweets', function(tweet, score) {

                if (score > 0) {
                    var html = '<p class="bg-success">' + tweet + '</p>';
                } else {
                    var html = '<p class="bg-danger">' + tweet + '</p>';
                }
                $('#tweet-container').append(html);
            });

            socket.emit('addhashtag', this.$input.val());

            $('ul', this.el).append("<b>" + this.$input.val() + "</b><br>");
        }



    });

})(jQuery);
