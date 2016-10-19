var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vdaySchema = new Schema({
    name: {type: String, required: true},
    date: {type: Date, required: true},
    version: {type: Number, required: true},
    comp_event_list: [{type: Schema.Types.ObjectId, ref: 'CompositeEvent', required: true}],
    std_event_list: [{type: Schema.Types.ObjectId, ref: 'StandaloneEvent', required: true}]
});



module.exports = mongoose.model('VisitingDay', vdaySchema);



