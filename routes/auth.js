var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var chalk = require('chalk');
var morgan	= require('morgan');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(morgan('dev'));
router.use(session({ secret: 'i_took_a_pill_in_ibiza', resave: true, saveUninitialized: true })); 
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());
//router.use(morgan('combined'));
router.use(function timeLog(req, res, next) {
 // console.log('Time: ', Date.now());
  next();
});



router.get('/',function(req,res){
	console.log(chalk.green('hello'));
	res.send('hello from auth');
});
router.get('/signup',function(req,res){
	console.log(chalk.cyan('register'));
	req.flash('info', 'Flash Message Added');
	res.render('view_signup',{ message: req.flash('signupMessage') });
	//res.render('view_signup',{ message: 'hey' });
	//res.send('register page');
});

module.exports = router;