/*
  apikey.js -- router for giving api-keys to a logged in user
  and letting them access a key/value repository with the api-key
  a developer gets an api-key for each app they want to create

*/
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
