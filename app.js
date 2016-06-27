var express = require('express');
//var birds = require('./routes/birds');
var activity = require('./routes/activity');
var app = express();

//--- used ejs--
app.set('view engine','ejs');

//app.use('/birds', birds);
app.use('/activity',activity);
//--- home page
app.get('/',function (req,res){
	//res.send('Hello world'); //raw text
	res.render('pages/index');
});
// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});


app.listen(3000,function (){
	console.log('server start');
});