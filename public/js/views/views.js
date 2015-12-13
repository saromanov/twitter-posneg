var app = app || {};


(function($) {
    'use strict';

    app.ItemView = Backbone.View.extend({
        el: $('body'),

        events: {
            'click button#add': 'showItem',
        },
        initialize: function() {
            _.bindAll(this, 'render', 'showItem', 'removeItem');
            this.collection = new app.ListItem();
            this.counter = 0;
            this.$input = this.$('.input-item');
            this.render();
        },

        render: function() {
            $('#inp').append("<button type='button' id = 'add' class='btn btn-primary btn-lg'>Add to track </button>");
        },

        showItem: function() {
            var socket = io();
            var text = this.$input.val();
            $(this.el).append("<h2 id=title" + this.counter + " class='bg-info'>" + (this.counter+1) + ". " + text + "</h2>");
            $(this.el).append("<div id='value" + this.counter+ "'>'<p id='back' class='bg-info'></p></div>");
            this.counter += 1;
            var newitem = new app.Item();
            newitem.set({
                title: text
            });
            this.collection.add(newitem);
            socket.on('tweets', function(tweet, score, id) {

                var currentClass = $('#title'+id).attr('class');
                var newclass = '';
                if (score > 0) {
                    var html = "<p class='bg-success'>" + tweet +  " : " + score + " : " + id + '</p>';
                    newclass = ' bg-success';
                } else if(score < 0){
                    var html = '<p class="bg-danger">' + tweet +  " : " + score + " : " + id + '</p>';
                    newclass = ' bg-danger';
                } else {
                    var html = '<p class="bg-info">' + tweet +  " : " + score + " : " + id + '</p>';
                    newclass = ' bg-info';
                }

                $('#title' + id).toggleClass(currentClass + newclass);
                $('#value' + id).html(html);
            });

            socket.emit('addhashtag', text);
        },

    });

})(jQuery);
