var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Content_Tag = require('../models/content_tag');
var Content = require('../models/content');
var chalk = require('chalk');
var mongoose = require('mongoose');
//var ObjectId = require('mongodb').ObjectID;

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(function timeLog(req, res, next) {
 // console.log('Time: ', Date.now());
  next();
});

router.get('/',function (req,res){
	res.json('get ja');
});
router.get('/tags/:tagName',function (req,res){
	console.log('params is '+req.params.tagName);
	// Content_Tag
 //    .find({tag_name:req.params.tagName})
 //    .populate('tag_id')
 //    .exec(function(err, result) {
 //      if (err){
 //      	console.log('Error in view survey codes function');
 //      }
 //      if (result){
 //      	console.log(result)
 //      }
 //    });
	Content_Tag.find({tag_name:req.params.tagName}, function (err,result) {
		if(err) {
			res.json({res:'get'+err});
		}else if(result){
			var id_arr = [];
			for(var i=0;i<result.length;i++){
	   			id_arr.push(mongoose.Types.ObjectId(result[i].content_id)); 
	   		}
			//console.log(id_arr);
			
			Content
		    .find({'_id':{$in:id_arr}})
		    .populate('owner')
		    .exec(function(err, doc) {
		      if (err){
		      	console.log(chalk.red('Error'+err));
		      }
		      if (doc){
		      	console.log(chalk.green("get doc "+doc.length));
		      	for(var i=0;i<doc.length;i++){
		      		console.log(chalk.yellow("-------"+i+"-------"));
		      		console.log(doc[i].caption);
		      		console.log(doc[i].owner.username);
		      	}
		      	res.json(doc);
		      }
		    });

		}
	});
	// Content_Tag.find({tag_name:req.params.tagName}).populate('tag_id').exec(function (err,result){
	// //Content_Tag.find({tag_name:req.params.tagName}).populate('tag_id').exec(function (err,result){
	// 	if (err){
	//   		console.log('err '+err);
	//   		res.json({res:'get'+err});
	//   	}//else
	//   	if(result){
	//   		var id_arr = [];
	//   		for(var i=0;i<result.length;i++){
	//   			id_arr.push(mongoose.Types.ObjectId(result[i].content_id)); 
	//   		}
	//   		var query = Content.find({});

	//   		// Content.find({
	//   		// 	'_id':{$in:id_arr}
	//   		// 	},function (err,doc){
	//   		// 	//	console.log('cb '+doc);
	//   		// 	if(err){
	//   		// 		console.log(chalk.red('Error doc '+err));
	//   		// 	}else if(doc){
	//   		// 		for(var i=0;i<doc.length;i++){
	//   		// 			console.log(chalk.bgGreen(doc[i].owner));
	//   		// 			console.log(chalk.bgYellow("-------------- end ------------"));
	//   		// 		}
	//   		// 	}
	//   		// });
	//   		res.json(result);
	//   	}else if(!result){
	//   		console.log("no result");
	//   	}
	// });
	//res.json('get tag '+req.params.tagName);
});


module.exports = router;