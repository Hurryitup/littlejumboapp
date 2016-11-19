var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//disccuss removing this with Aditya
/*var lastUpdatedSchema = new Schema({
    field: {type: String, required: true},
    time: {type: Date, required: true},
    author: {type: String, required: true}
});
*/

var CompositeEvent = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    standalone_events: [{
        type: Schema.Types.ObjectId,
        ref: 'StandaloneEvent',
    }]
});

module.exports = mongoose.model('CompositeEvent', CompositeEvent);
