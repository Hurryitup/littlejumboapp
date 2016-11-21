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

/*
 * Routes recieves a post containing all the visting day information
 * the list of composite and/or standalone events may be empty
 * responds with the newly created document
 */
router.post('/visiting_days', function(req, res) {
    var vday = req.body;
    if (!vday.version) { vday.version = -1; }
    VisitingDay.create(vday, function (err, doc) {
        if (!err) {
            res.json(doc);
        } else {
            console.log(err);
            res.sendStatus(500);
        }
    });
});


router.post('/composite_events', function(req, res) {
    var ce = req.body;
    var p_id = req.body.parent_id;
    var Parent = mongoose.model(req.body.parent_model);
    delete ce.parent_id;
    delete ce.parent_model;

    
    CompositeEvent.create(ce, function (err, doc) {
        if (!err) {
            Parent.findById(p_id, function (err2, p_doc) {
                if (!err2) {
                    p_doc.composite_events.push(doc.id);
                    p_doc.save(function (err3, saved) {
                        if (!err3) {
                            return res.json(doc);
                        } else {
                            console.log (err3);
                            return res.sendStatus(500);
                        }
                    });
                } else {
                    console.log(err2);
                    res.sendStatus(500);
                }
            });
        } else {
            console.log(err);
            res.sendStatus(500);
        }
    });
   
    
});
router.post('/standalone_events', function(req, res) {
    var se = req.body;
    var p_id = req.body.parent_id;
    var Parent = mongoose.model(req.body.parent_model);
    delete se.parent_id;
    delete se.parent_model;

    StandaloneEvent.create(se, function (err, doc) {
        if (!err) {
            Parent.findById(p_id, function (err2, p_doc) {
                if (!err2) {
                    p_doc.standalone_events.push(doc.id);
                    p_doc.save(function (err3, saved) {
                        if (!err3) {
                            return res.json(doc);
                        } else {
                            console.log (err3);
                            return res.sendStatus(500);
                        }
                    });
                } else {
                    console.log(err2);
                    res.sendStatus(500);
                }
            });
        } else {
            console.log(err);
            res.sendStatus(500);
        }
    });
});

router.get('/visiting_days/:id', function(req, res) {
    var vday_id = req.params.id;
    var populate = req.query.populate.replace(',', ' ');
    VisitingDay.findById(vday_id).populate(populate)
    .exec(function (err, day) {
        if (err) {
            console.log(err);
            return res.status(500).send('Database Error');
        } else {
            return res.json(day); 
        }
    });
});

router.get('/delete_item', function (req, res) {
    var Model = mongoose.model(req.query.model);
    var id = req.query.id;
    Model.findByIdAndRemove(id, function (err, success) {
        if (!err) {
            return res.sendStatus(200);
        } else {
            console.log(err);
            return res.sendStatus(500);
        }
    });
    
});

router.get('/publish', function (req, res) {
    if (req.query.id) {
        VisitingDay.id(req.query.id)
        .exec(function (err, doc) {
            if (!err) {
                doc.version *= -1;
                doc.save(function (err, saved) {
                    return res.json(saved);
                });
            } else {
                return res.sendStatus(500);
            }
        });
    } else {
        return res.sendStatus(400);
    }
});

module.exports = router;
