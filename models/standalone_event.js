var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StandaloneEvent = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coordinator: {
        type: String,
        required: true
    },
    location_address: {
        type: String,
        required: true
    },
    location_lat: {
        type: Number,
        required: true
    },
    location_long: {
        type: Number,
        required: true
    },
    audience: {
        type: String,
        required: true,
        enum: ['Student', 'Parent', 'All']
    },
    balloon_color: {
        type: String
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('StandaloneEvent', StandaloneEvent);