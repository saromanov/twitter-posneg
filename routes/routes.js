var app = app || {};

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var Model = mongoose.model('Model', {hashtag: String, posvalue: Number, negvalue: Number});
app.Model = Model;

// Show past results from values
exports.getData = function(req, res){
    Model.find(function(arr, data){
        res.send(data);
    });
};
