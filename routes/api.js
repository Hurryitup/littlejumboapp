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

// add 
module.exports = router;