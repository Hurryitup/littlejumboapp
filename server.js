var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(__dirname));
app.set('view engine', 'pug');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoUri = process.env.MOGOLAB_URI || process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/littlejumboapp';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var ObjectID = require('mongodb').ObjectID;
var db = MongoClient.connect(mongoUri, function(error, databaseConenction) {
    if (databaseConenction != null) {
            db = databaseConenction;
    } else {
        console.log(error);
    }
});
mongoose.connect(mongoUri);

var Schema = mongoose.Schema;
var VirtualType = mongoose.VirtualType;
var StdEvent = require('./models/std_event');
var CompEvent = require('./models/comp_event');
var VDay = require('./models/visiting_day');



app.get('/', function (req, res) {
    res.render("index",{title: "Hey", message: "test"});
});

/*should be abstracted to a module but I will leave in here for now*/

/* Description: Function flattenSchema takes in an Object that is in the format
 * of a Schema.tree and returns the object with fields as strings or nested
 * flattened schemas. Works recursively
 */
function flattenSchema( schema) {
    for (var key in schema) {
        if (key[0] == '_') {
            delete schema[key]
        } else if (schema[key].type) {
            if (schema[key].type instanceof Schema) {
                schema[key].type = flattenSchema(schema[key].type.tree);
            } else if (schema[key].type.name) {
                schema[key].type = schema[key].type.name;
            } else if (schema[key].type instanceof VirtualType) {
                delete schema[key];
            }
        } else if (schema[key].name) {
            schema[key] = schema[key].name;
        }  else if (schema[key] instanceof VirtualType) {
                delete schema[key];
        }
                
    }
    return schema;
}



app.get('/getSchema', function (req, res) {
    var Model  = mongoose.model(req.query.model);
//    console.log(Model.schema.tree);
    schemaTree = Model.schema.tree;
    schemaTree = flattenSchema(schemaTree);
    console.log(schemaTree);
    return res.send(schemaTree);
});



app.get('/listVdays', function (req, res) {
    VDay.find().lean().exec(function (err, days) {
        if (err) 
            return res.status(500).send("Database Error");
        return res.send(days);
        });
});

app.get('/vday', function (req, res) {
    var vday_id = req.query.id;
    VDay
        .findById(vday_id)
        .populate('comp_event_list std_event_list')
        .exec(function (err, doc) {
            if (err)
                return res.status(500).send("Database Error");
            return res.send(doc.toJSON()); 
        });
});


app.listen(process.env.PORT || 5000);

