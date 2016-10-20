var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timeSchema = new Schema({
    start: {type: Date, required: true},
    end: {type: Date, required: true}
});

//disccuss removing this with Aditya
/*var lastUpdatedSchema = new Schema({
    field: {type: String, required: true},
    time: {type: Date, required: true},
    author: {type: String, required: true}
});
*/

var compEventSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    start_time: {type: Date, required: true},
    end_time: {type: Date, required: true},
    event_list: [{type: Schema.Types.ObjectId, ref: 'StandaloneEvent', required: true}]
});

module.exports = mongoose.model('CompositeEvent', compEventSchema);

