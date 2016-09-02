var express = require('express');
var router = express.Router();
//var users = require('../models/users');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Activity Page');
});



// define the about route
router.get('/about', function(req, res) {
  res.send('about activity');
});

module.exports = router;