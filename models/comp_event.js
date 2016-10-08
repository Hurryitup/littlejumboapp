var mongoose = require('mongoose');
var Schema = mongoose.Schema
var schema = new Schema({
    title: String,
    description: String,
    time: {
        start: Date,
        end: Date
    },
    last_updated:
    {
        field: String,
        time: Date,
        author: String
    },
    event_list: [{type: Schema.Types.ObjectId, ref: 'StandardEvent'}]
});

module.exports = mongoose.model('CompositeEvent', schema);

