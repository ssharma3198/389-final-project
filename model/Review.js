var mongoose = require('mongoose');

var ReviewScheme = new mongoose.Schema({
    rating:{
        type: Number,
        min: 0.0,
        max: 5.0,
        required: true
    },
    poster:{
        type:String,
        required: true
    },
    comment:{
        type: String
    },
    author:{
        type: String,
        required: true
    },
    book:{
        type: String,
        required: true
    },
    genre:{
        type: Array
    },
    date:{
        type: String,
        required: true
    }
});

var Review = module.exports = mongoose.model('Review', ReviewScheme);