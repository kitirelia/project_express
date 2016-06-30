var express = require('express');
var router = express.Router();
var users = require('../models/users');

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
    var arr= users.findById(id);

   var obj={
   		data:{
		   	head:{
		   		title:"head_title"
		   	},
		   	body:{
		   		body_color:'black',
		   		username:'mel_b',
		   		message:'hello this is me!',
		   		names:['morata','worth it','acivii','john legend']
		   	},
		   	footer:{
		   		message:null,
		   		blank:undefined
		   	}
	    }
    }
    res.render('pages/feed',obj);
});

// define the about route
router.get('/about', function(req, res) {
  res.send('about activity');
});

module.exports = router;