var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
var timeSchema = new Schema({
    start: {type: Date, required: true},
    end: {type: Date, required: true}
});
*/
/*
var lastUpdatedSchema = new Schema({
    field: {type: String, required: true},
    time: {type: Date, required: true},
    author: {type: String, required: true}
});
*/
/*
var locationSchema = new Schema({
    name: {type: String, required: true},
    address: {type: String, required: true}
});
*/

var stdEventSchema = new Schema({
    title: {type: String, required: true},
    coordinator: {type: String, required: true},
    location_name: {type: String, required: true},
    location_address: {type: String, required: true},
    student_or_parent: {type: String, enum: ['Student', 'Parent']},
    balloon_color: String,
    description: {type: String, required: true},
    start_time: {type: Date, required: true},
    end_time: {type: Date, required: true}
});




module.exports = mongoose.model('StandaloneEvent', stdEventSchema);
        
