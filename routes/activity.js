var express = require('express');
var router = express.Router();
var users = require('../model/users');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/', function(req, res) {
  res.send('Activity Page');
});

//------------ start modify
router.get('/user',function(req,res){
	//var id = req.params.id;
	console.log("search id ");
});
router.get('/user/:id', function (req, res) {
    var id = req.params.id;
    res.json(users.findById(id));
});

// define the about route
router.get('/about', function(req, res) {
  res.send('about activity');
});

module.exports = router;