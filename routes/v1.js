var express = require('express');
var chalk = require('chalk');
var bodyParser = require('body-parser');
var User = require('../models/users.js');
var mongoose = require('mongoose');
var router = express.Router();

router.use(function(req, res, next) {
  // .. some logic here .. like any other middleware
  res.contentType('application/json');
  console.log("api v1");
  next();
});

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//mongoose.connect('localhost:27017/express_db');
//mongoose.set('debug', true);
// mongoose.connection.on('open', function (ref) {
// 	//console.log(chalk.green('Connected to mongo server.'));
// });

// mongoose.connection.on('error', function (err) {
// // console.log(chalk.red('Connected to mongo server.'));
//   //console.log(err);
// });

router.get('/',function (req,res){
	console.log(chalk.white.bgGreen.bold('GET api page'));
	res.json({"msg":"hello"});
});

router.post('/',function (req,res){
	console.log(chalk.white.bgYellow.bold('POST api page'+req.body.name));
	console.log(chalk.red("get body.name"+req.body.name,req.body.email));

	var chris = new User({
	  name: req.body.name,
	  username: req.body.username,
	  password: req.body.password,
	  email: req.body.email  
	});
	console.log(chalk.cyan(chris));
	// chris.dudify( function(err,name){
	// 	if(err) throw err;
	// 	console.log('Your new name is ' + req.body.name);
	// });

	chris.save(function (err){
		var data;
		if(err){
			var err_msg="";
			//console.log(chalk.red("Error! "+err));
			if(err.errors.name){
				console.log(chalk.red("Error!name "+err.errors.name.message));
				err_msg=err.errors.name.message;
			}
			else if(err.errors.username){
				console.log(chalk.red("Error!name "+err.errors.username.message));
				err_msg = err.errors.username.message;
			}
			else if(err.errors.email){
				console.log(chalk.red("Error!name "+err.errors.email.message));
				err_msg = err.errors.email.message;
			}
			else if(err.errors.password){
				console.log(chalk.red("Error!name "+err.errors.password.message));
				err_msg = err.errors.password.message;
			}
			data ={
				result:'error',
				message:err_msg
			}
			res.json(data);
			//res.json(obj); 
		}else{
			data ={
				result:'success',
				message:'ok'
			}
			res.json(data); 
		} 
		//console.log('User saved successfully!');
	});
	
});
module.exports = router;