var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CompositeEvent = require('../models/composite_event');
var StandaloneEvent = require('../models/standalone_event');
var VisitingDay = require('../models/visiting_day');

router.get('/forms', function(req, res) {
    res.render('form', { title: 'Hey7', message: 'test' });
});

/*should be abstracted to a module but I will leave in here for now*/

/* Description: Function flattenSchema takes in an Object that is in the format
 * of a Schema.tree and returns the object with fields as strings or nested
 * flattened schemas. Works recursively
 */
function flattenSchema(schema) {
    var Schema = mongoose.Schema;
    var VirtualType = mongoose.VirtualType;

    for (var key in schema) {
        if (key[0] == '_') {
            delete schema[key];
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

router.get('/schema', function(req, res) {
    var Model = mongoose.model(req.query.model);
    var schemaTree = flattenSchema(Model.schema.tree);
    console.log(schemaTree);
    res.send(schemaTree);
});

router.get('/visiting_days', function(req, res) {
    VisitingDay.find().lean()
    .exec(function(err, days) {
        if (err) {
            console.log(err);
            res.status(500).send('Database Error');
        }
        else {
            res.json(days);
        }
    });
});

router.get('/visiting_days/:id', function(req, res) {
    var vday_id = req.params.id;
    VisitingDay.findById(vday_id).populate('composite_events standalone_events')
    .exec(function (err, day) {
        if (err) {
            console.log(err);
            res.status(500).send('Database Error');
        }
        else {
            res.json(day); 
        }
    });
});

module.exports = router;