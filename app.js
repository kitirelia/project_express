var express = require('express');
var bodyParser = require('body-parser');
//var multer = require('multer');
var activity = require('./routes/activity');
var upload = require('./routes/upload');
var app = express();
//var multer_upload = multer({ dest: 'uploads/' });

//--- used ejs--
app.set('view engine','ejs');

//var upload = multer({ dest: 'uploads/' });
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/activity',activity);
app.use('/upload',upload);
//--- home page
app.get('/',function (req,res){
	res.render('pages/index');
});

app.get('/feed', function(req, res) {
    res.render('pages/feed');
});
// app.post('/upload', upload.single('avatar'),  function(req, res) {
//   console.log(req.file);
// });

app.listen(3000,function (){
	console.log('server start');
});