var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io=require('socket.io')
var session = require('express-session')
var routes = require('./routes/index');
var users = require('./routes/users');
var contact_routers=require('./routes/contact_routers')
var app = express();
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(
  {
      secret:'landscape',
      name:'connect.sid',
      cookie:{maxAge:1400000},
      resave:true,
      saveUninitialized:true
  }
));

app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
  //console.log(req.session);
  if (typeof req.session.user=='undefined'){
    console.log('app filter');
    if(req.url=='/login'||req.url=='/test')
    {
      next();
    } else if (req.url=='/registe')
    {
      next();
    } else
      res.redirect('/login')
  } else{
    next();
  }
})
app.use('/contact',contact_routers)
app.use('/', routes);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('building', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('building', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
