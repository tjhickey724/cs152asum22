var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layouts = require("express-ejs-layouts");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(layouts)
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/simpleform',
  (req,res,next) => {
    res.render('simpleform')
  })

  app.post("/simpleform", (req, res, next) => {
    // res.json(req.body);
    const { username, age, height } = req.body;
    res.locals.username = username;
    res.locals.age = age;
    res.locals.ageInDays = age * 365;
    res.locals.height = height;
    res.locals.heightCm = height * 2.54;
    res.locals.version = "1.0.0";
    res.render("simpleformresult");
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
