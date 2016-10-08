var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    date: Date,
    comp_event_list: [{type: Schema.Types.ObjectId, ref: 'CompositeEvent'}],
    std_event_list: [{type: Schema.Types.ObjectId, ref: 'StandardEvent'}]
});



module.export = mongoose.model('VistingDay', schema);



