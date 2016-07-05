var express = require('express');
var chalk = require('chalk');
var User = require('../models/users.js');
var mongoose = require('mongoose');
var router = express.Router();

router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  res.contentType('application/json');
  console.log("api v1");
  next();
});

mongoose.connect('localhost:27017/arsenal_db');
mongoose.set('debug', true);
mongoose.connection.on('open', function (ref) {
	console.log(chalk.green('Connected to mongo server.'));
});

mongoose.connection.on('error', function (err) {
 console.log(chalk.red('Connected to mongo server.'));
  console.log(err);
});

router.get('/',function (req,res){
	console.log(chalk.white.bgGreen.bold('GET api page'));
	res.json({"msg":"hello"});
});

router.post('/',function (req,res){
	console.log(chalk.white.bgYellow.bold('POST api page'+req.body.name));

	var chris = new User({
	  name: req.body.name,
	  username: req.body.username,
	  password: req.body.password,
	  email: req.body.email  
	});
	// chris.dudify( function(err,name){
	// 	if(err) throw err;
	// 	console.log('Your new name is ' + req.body.name);
	// });

	chris.save(function (err){
		if(err){
			console.log("error message \n"+err.message);
			console.log("error name \n"+err.name);
			var msg_type ="";
			if(err.errors.username){
				msg_type ='username already exist';
			}else if(err.errors.email){
				//console.log(err.errors.email.message);
				//console.log(err.errors.email.name);
				//console.log(err.errors.email.type);
				// if(err.errors.email.name==="Path `email` is required."){
				// 	msg_type = 'email already exist';
				// }
				msg_type = err.errors.email.message;
			}
			var obj ={
				'msg':err.message,
				'type':msg_type
			}
			res.json(obj); 
		}else{
			res.json({ message: 'User created!'+req.body.name}); 
		} 
		//console.log('User saved successfully!');
	});
	
});
module.exports = router;