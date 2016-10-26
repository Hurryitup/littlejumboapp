var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VisitingDay = new Schema({
    name: {
    	type: String,
    	required: true
    },
    date: {
    	type: Date,
    	required: true
    },
    version: {
    	type: Number,
    	required: true
    },
    composite_events: [{
    	type: Schema.Types.ObjectId,
    	ref: 'CompositeEvent',
    	required: true
    }],
    standalone_events: [{
    	type: Schema.Types.ObjectId,
    	ref: 'StandaloneEvent',
    	required: true
    }]
});

module.exports = mongoose.model('VisitingDay', VisitingDay);