var app = app || {};

(function () {

    'use strict';

    app.Item = Backbone.Model.extend({
       defaults: {
           title: '',
           msg: '',
           score: 0,
           posvalues: 0,
           negvalues: 0
       }
   });

    app.ListItem = Backbone.Collection.extend({
         model: app.Item
    });

})();

