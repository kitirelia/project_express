var express = require('express');
var bodyParser = require('body-parser');
//var multer = require('multer');
var activity = require('./routes/activity');
var upload = require('./routes/upload');
var populate = require('./routes/populate');
var gutil = require('gulp-util');
//var api = require('./routes/api');
var user_api = require('./routes/v1');
var bypass_upload = require('./routes/bypass_upload');
var explore = require('./routes/explore');
var newfeed = require('./routes/newfeed');
var chalk = require('chalk');
var mongoose = require('mongoose');
var port = process.env.PORT ||3000;
var app = express();

//--- used ejs--
app.set('view engine','ejs');
app.set('views','./views/pages/');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/activity',activity);
app.use('/upload',upload);
app.use('/bypass_upload',bypass_upload);
app.use('/newfeed',newfeed);
//app.use('/api',api);
app.use('/api/v1',user_api);
app.use('/populate',populate);
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/public',express.static(__dirname + '/public'));
app.use('/explore',explore);
//app.use(express.static('uploads'));
//--- home page
app.get('/',function (req,res){
	res.render('register');
});

app.get('/debug',function(req,res){
	res.render('view_tag');
});
app.get('/feed', function(req, res) {
    res.render('pages/feed');
});

mongoose.connect('127.0.0.1:27017/express_db');
//mongoose.set('debug', true);
mongoose.connection.on('open', function (ref) {
	console.log(chalk.bgGreen('content Connected to mongo server.'));
});

mongoose.connection.on('error', function (err) {
 	console.log(chalk.red('Error to mongo server.'));
 	 console.log(err);
});
app.listen(port,function (){
	console.log(gutil.colors.green('server start...'+port));
});