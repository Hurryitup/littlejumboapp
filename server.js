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

var StdEvent = require('./models/std_event');
var CompEvent = require('./models/comp_event');
var VisitingDay = require('./models/visiting_day');




app.get('/', function (req, res) {
    res.render("index",{title: "Hey", message: "test"});
});


/*Sample requests (not functional or good)
app.get('/update',  function (req, res) {
    var updatepage = Handlebars.compile(eventpage)
    updatepage = updatepage(eventSchema)
    res.send(updatepage);
       var collname = req.query.collname;
       var newCollection = mongoose.model(collname, eventSchema);
       res.send(null)
}

app.get('listStudentEventsOnDate', function (req, res) {
    var collname = req.query.date
    newCollection = mongoose.model(collname);

*/
app.listen(process.env.PORT || 5000);

