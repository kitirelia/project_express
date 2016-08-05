var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Content = require('../models/content');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.get('/', function(req, res) {
  console.log('Here new feed');
  var content = new Content();
  	content.getFeed(function (err,docs){
  		if(err){
  			res.json({res:'error'});
  		}else if(docs){
  			var data = JSON.stringify(docs);
  			//console.log('data ',docs[0]);
  			 var html_str="";
  			 var image_folder = "/uploads/flash/";
  			 for(var i=0;i<docs.length;i++){
  			 	html_str+="<div>";
  			 	html_str+='<img src="'+image_folder+docs[i].filename+'" alt="Smiley face" height="100" width="100">';
  			 	html_str+="<div>";
  			 	html_str+=docs[i].caption;
  			 	html_str+="</div>";
  			 	html_str+="</div>";
  			 }
  			//console.log(html_str);
  			res.render('view_newfeed',{data:html_str});
  		}
  	});
 	//res.render('newfeed');
  //res.json({message:'new feed here'});
}); 

module.exports = router;