var express = require('express');
var bodyParser = require('body-parser');
//var multer = require('multer');
var activity = require('./routes/activity');
var upload = require('./routes/upload');
var gutil = require('gulp-util');
var api = require('./routes/api');
var port = process.env.PORT ||3000;
var app = express();

//--- used ejs--
app.set('view engine','ejs');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/activity',activity);
app.use('/upload',upload);
app.use('/api',api);
//--- home page
app.get('/',function (req,res){
	console.log("hey "+req.body.caption);
	res.render('pages/index');
});

app.get('/feed', function(req, res) {
    res.render('pages/feed');
});

app.listen(port,function (){
	console.log(gutil.colors.green('server start...'+port));
});