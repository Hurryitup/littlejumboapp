var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timeSchema = new Schema({
    start: {type: Date, required: true},
    end: {type: Date, required: true}
});
var lastUpdatedSchema = new Schema({
    field: {type: String, required: true},
    time: {type: Date, required: true},
    author: {type: String, required: true}
});

var stdEventSchema = new Schema({
    title: {type: String, required: true},
    coordinator: {type: String, required: true},
    location: {name: String, address: String},
    std_or_prnt: {type: String, enum: ['Student', 'Parent']},
    balloon_color: String,
    description: {type: String, required: true},
    time: {type: timeSchema, required: true},
    last_updated: {type: lastUpdatedSchema, required: true}
//    belongs_to_composite: Boolean
});




module.exports = mongoose.model('StandaloneEvent', stdEventSchema);
        
