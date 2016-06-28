var express = require('express');
//var birds = require('./routes/birds');
var activity = require('./routes/activity');
var upload = require('./routes/upload');
var app = express();

//--- used ejs--
app.set('view engine','ejs');

//app.use('/birds', birds);
app.use('/activity',activity);
app.use('/upload',upload);
//--- home page
app.get('/',function (req,res){
	//res.send('Hello world'); //raw text
	res.render('pages/index');
});
// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});
// about page 
app.get('/feed', function(req, res) {
    res.render('pages/feed');
});



app.listen(3000,function (){
	console.log('server start');
});