var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var api = require('./routes/api');
var backend = require('./routes/backend');

var app = express();

app.set('json spaces', 2);
app.locals.pretty = true;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public'));

app.use('/api', api);
app.use('/backend', backend);

var mongoUri = process.env.MLAB_URI || process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/littlejumboapp';

mongoose.connect(mongoUri);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if (err.status == 404) {
    res.status(404).send('Not found');
  }
  else {
    next(err);
  }
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(process.env.PORT || 5000);
