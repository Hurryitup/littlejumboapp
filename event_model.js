var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eventSchema = new Schema({
    title: String,
    coordinator: String,
    location: String,
    std_or_prnt: {type String, enum: ['Student', 'Parent']},
    description: String,
    time: 
        {
            start: Date,
            end: Date
        },
    last_updated: 
        {
            field: String,
            time: Date,
            author: String
        });
module.exports = eventSchema
        
