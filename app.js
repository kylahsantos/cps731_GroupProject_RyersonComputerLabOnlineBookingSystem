var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./db');
require("express-async-errors");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);
require('./models/dbConfig');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const adminController = require('./controllers/adminController');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', [path.join(__dirname, 'views'),
                  path.join(__dirname, 'views/admin/'), 
], { layout: 'layout.hbs' });

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false, 
  saveUninitialized: true,
  secret: 'secretword',
  store: new MongoStore({ url: db.url }),
}));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// partials directory setup
const hbs = require('hbs');
hbs.registerPartials(__dirname + '/views/partials');

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/*
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/layout.hbs'));
});*/

/*
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, 'views/admin/layout.hbs'));
});*/

console.log(app.get('views'));

app.use('/admin', adminController);

module.exports = app;
