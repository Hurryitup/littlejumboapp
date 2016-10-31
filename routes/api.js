var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var CompositeEvent = require('../models/composite_event');
var StandaloneEvent = require('../models/standalone_event');
var VisitingDay = require('../models/visiting_day');

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

// TODO
router.post('/visiting_days', function(req, res) {
    res.json(req.body);
});
router.post('/composite_events', function(req, res) {
    res.json(req.body);
});
router.post('/standalone_events', function(req, res) {
    res.json(req.body);
});

router.get('/visiting_days/:id', function(req, res) {
    var vday_id = req.params.id;
    var populate = req.query.populate.replace(',', ' ');
    VisitingDay.findById(vday_id).populate(populate)
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