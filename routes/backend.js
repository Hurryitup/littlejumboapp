var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* DUPLICATE FUNCTION PLEASE MODULARIZE */
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

router.get('/visiting_days/new', function(req, res) {
    var Model = mongoose.model('VisitingDay');
    var schemaTree = flattenSchema(Model.schema.tree);
    res.render('form', {
        schema: schemaTree,
        action: '/api/visiting_days',
        form_name: 'Visiting Day',
        parent_model : req.query.parent_model,
        parent_id : req.query.parent_id,
    });
});

router.get('/standalone_events/new', function(req, res) {
    var Model = mongoose.model('StandaloneEvent');
    var schemaTree = flattenSchema(Model.schema.tree);
    res.render('form', {
        schema: schemaTree,
        action: '/api/standalone_events',
        form_name: 'Standalone Event',
        parent_model : req.query.parent_model,
        parent_id : req.query.parent_id,
    });
});

router.get('/composite_events/new', function(req, res) {
    var Model = mongoose.model('CompositeEvent');
    var schemaTree = flattenSchema(Model.schema.tree);
    res.render('form', {
        schema: schemaTree,
        action: '/api/composite_events',
        form_name: 'Composite Event',
        parent_model : req.query.parent_model,
        parent_id : req.query.parent_id,
    });
});

module.exports = router;
