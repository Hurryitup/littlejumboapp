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


var compEventSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    time: {type: timeSchema, required: true},
    last_updated: {type: lastUpdatedSchema, required: true},
    event_list: [{type: Schema.Types.ObjectId, ref: 'StandardEvent', required: true}]
});

module.exports = mongoose.model('CompositeEvent', compEventSchema);

