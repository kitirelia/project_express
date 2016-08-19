var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Content_Tag = require('../models/content_tag');
var User = require('../models/users');
var Content = require('../models/content');
var Content_Tag = require('../models/content_tag');
var chalk = require('chalk');
var mongoose = require('mongoose');
var moment = require('moment');
var url = require('url');
var path = require('path');
//var ObjectId = require('mongodb').ObjectID;

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(function timeLog(req, res, next) {
 // console.log('Time: ', Date.now());
// console.log(req.originalUrl);
  next();
});

///////////////////////////////////////////////////
///////////////// /all_user  //////////////////////
///////////////////////////////////////////////////
router.get('/all_user',function (req,res){
	//res.json('get ja');
	console.log(chalk.magenta('search all user '));
	var sum_users = 0;
	User.count({}, function( err, count){
		if(err){
			sum_users = 0;
		}
	    console.log( "Number of users:", count );
	    sum_users = count;
	})
	User
	.find({},function (err,result){
		if(err){
			res.json({result:'error',msg:'error '+err});
		}else if(result){
			var image_folder = "/uploads/flash/";
			var html_str="";
			for(var i=0;i<result.length;i++){
				html_str+="<div>";
				html_str+="<img src =' "+image_folder+result[i].profile_image+"'  >";
				html_str+=	"<div>";
				html_str+=	"<p>"+result[i]._id+"</p>";
				html_str+=	"<p>"+result[i].username+"</p>";
				html_str+=	"<p>"+result[i].name+"</p>";
				html_str+=	"</div>";
				html_str+="</div>";
			}
			var json_data = {
				html:html_str,
				all_user:sum_users
			};
			res.render('view_all_user',{data:json_data});
		}
	});
});

///////////////////////////////////////////////////
///////////////// /people/username  ///////////////
///////////////////////////////////////////////////

router.get('/people/:userName',function (req,res){
	//console.log(chalk.cyan('search user '));
	var search_name = (req.params.userName).replace(/\s/g, "") ;
	User.
	find({'username' : new RegExp(search_name, 'i')},null, {sort: {username: 1},limit:10},function (err,doc){
		if(err){
			res.json({msg:'Errr '+search_name});	
		}else if(doc.length){	
			var found_index =-1;
			//console.log('get '+doc.length);
			var image_folder = "/uploads/flash/";
			var result = {
				msg:'success',
				type:'user',
				user:doc
			}
			res.json(result);
			
		}else if(doc.length==0){
			res.json({msg:'notfound',
				type:'user',
				user:search_name
			});
		}
	});
	//search_name	
});

router.get('/person/:userName',function (req,res){
	var search_name = (req.params.userName).replace(/\s/g, "") ;
	User
	.findOne({'username':search_name},function (err,doc){
		if(err){
			console.log(chalk.red("findOne Error "+err));
		}else{
			if(doc){
				var profile_picture="";
				var image_folder = "/uploads/flash/";
				profile_picture = image_folder+doc.profile_image;
				var nick_name= doc.name;
				console.log(chalk.bgCyan(doc._id,profile_picture));
				Content
				.find({'owner':doc._id})
				.populate({path:'owner'})
				.exec(function (err,result){
					if(err){
						console.log(chalk.red('populate content err '+err));
					}else if(result){
						//var all_post=result.length;
						//console.log('post '+all_post);
						for(var i=0;i<result.length;i++){
							//console.log(result[i]);
							//console.log(result[i].owner.username);
							result[i].filename=image_folder+result[i].filename;
						}

						console.log(chalk.cyan('--------------------'));
						res.render('view_person',{
					 	msg:'success',
					 	profile_img:profile_picture,
					 	user_name:search_name,
					 	all_post:result.length,
					 	nickname:nick_name,
					 	data:result
				 });
					}
				});
				
			}else{
				res.json({msg:'notfound',
						type:'tags',
						user:search_tag
				});
				console.log(chalk.bgRed("User Not found"));
			}
			
		}
	});
	//
});

function show_personal_page(uid){
	console.log('-------------- search person')
	Content
	.find({'owner':uid})
	.populate({path:'owner'})
	.exec(function (err,doc){
		if(err){
			console.log(chalk.red('populate content err '+err));
		}else if(doc){
			for(var i=0;i<doc.length;i++){
				console.log(doc[i].owner.username);
			}
			console.log(chalk.cyan('--------------------'));
		}
	});
}


///////////////////////////////////////////////////
///////////////// tags/tagName  ///////////////////
///////////////////////////////////////////////////
router.get('/nav_tags/:tagName',function (req,res){
	var search_tag = (req.params.tagName).trim();
	//console.log(chalk.magenta('search # '+search_tag));
	Content_Tag
		.aggregate([
	    { 
	    	$match: {  
	    		tag_name: { $regex: new RegExp(search_tag, 'i') } 
	    	} 
	    }, 
	    { 
	  		$group: { 
	         _id: '$tag_name'
	       , post: { $sum: 1 } 
	      }
	   },
	   { 
		   	$sort: {
		   		post:-1 
		   	}
	   },
	   {
	   		$limit:10
	   }
	], function(err, doc) {
	  		if(err){
				console.log(chalk.red('error nav tag'));
			}else{
				if(doc.length){
					for(var i=0;i<doc.length;i++){
					//console.log(chalk.green('found :'+doc[i]._id,doc[i].post));
					}
					var result = {
						msg:'success',
						type:'tags',
						user:doc
					}
					res.json(result);
				}else{
					console.log(chalk.bgGreen('NOT FOUND'));
					res.json({msg:'notfound',
						type:'tags',
						user:search_tag
					});
				}
				
			}
		//console.log(chalk.bgCyan('-------------------'));
	});
});


router.get('/tags/:tagName',function (req,res){
	console.log('get req '+req.params.tagName);
	var requrl = url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: req.originalUrl,
	});
	var clean_path = "http://localhost:3000/explore/tags/";
	//console.log(chalk.bgCyan(clean_path));
	Content_Tag.find({tag_name:req.params.tagName}, function (err,result) {
		if(err) {
			res.json({res:'Error'+err,
				data:[]
			});
		}else if(result){
			var id_arr = [];
			for(var i=0;i<result.length;i++){
	   			id_arr.push(mongoose.Types.ObjectId(result[i].content_id)); 
	   		}
			Content
		    .find({'_id':{$in:id_arr}})
		    .sort({'createdAt':-1})
		    .populate(
		    	{
		    		path:'owner',
		    		options: { 
		    			limit: 5 
		    		}//end option
		    	}
		    )
		    .exec(function(err, doc) {
		      if (err){
		      	console.log(chalk.red('Error'+err));
		      	res.json({res:'Error'+err,
					data:[]
				});
		      }
		      if (doc){
		      	console.log(chalk.green("get doc "+doc.length));
		      	var image_folder = "/uploads/flash/";
		      	var html_str="";
		      	for(var i=0;i<doc.length;i++){
		      		//console.log(doc[i]);
		      		doc[i].caption=hili_tag(doc[i].caption,clean_path);
		      		doc[i].filename=image_folder+doc[i].filename;
		      	}///end for
		       	var result = {
					 	msg:'success',
					 	hashtag_name:req.params.tagName,
					 	all_post:doc.length,
					 	data:doc
				 }
					//res.json(result);
		      	res.render('view_tag',{
					 	msg:'success',
					 	hashtag_name:req.params.tagName,
					 	all_post:doc.length,
					 	data:doc
				 });
		      }//end if
		    });//end Content.find({'_id':{$in:id_arr}})
		}
	});
	
});//end ('/get')

///////////////////////////////////////////////////
///////////////// END tags/tagName  ///////////////
///////////////////////////////////////////////////

function hili_tag(str,url){
			var html_str="";
			var found=false;
			var buffering =false;
			var buffer_text="";
			var found_index=0;
			var flag_arr=['#','@'];
			var prefix="";
			var path ="";
						
			for(var i=0;i<str.length;i++){
				if(flag_arr.indexOf(str.charAt(i))>=0){
					prefix=flag_arr[flag_arr.indexOf(str.charAt(i))];
					if(prefix==="#"){
						path =url;
					}else if(prefix!="#"){
						path ="http://www.google.com/";
					}
					if(!buffering){	
						buffering=true;
						buffer_text="";
						found_index=i;
					}else if(buffering){
						html_str+='<a href="'+path+(buffer_text.toLowerCase().trim())+'/">'+prefix+buffer_text+'</a>';
						buffer_text="";
						found_index=i;
					}
				}
				if(buffering){
					if((isEmo(str.charAt(i)) || isPunctuation(str.charAt(i)) || str.charAt(i)==" " || i>=str.length-1) && i>found_index ){
						//console.log('case to end '+str.charAt(i),i);
						var end_str="";
						if(!(i>=str.length-1)|| !(isPunctuation(str.charAt(i))) ){
							buffer_text+=str.charAt(i);
						}
						html_str+='<a href="'+path+(buffer_text.toLowerCase().trim())+'/">'+prefix+buffer_text+'</a>'+end_str;
						buffer_text="";
						buffering=false;
					}else{
						if(str.charAt(i)!=="#" && str.charAt(i)!=="@")buffer_text+=str.charAt(i);
					}
				}
				else if(!buffering){
					html_str+=str.charAt(i);
				}
			}
			//console.log(html_str);
			return html_str;
}//end hilitag
function readable_time(UNIX_timestamp) {
			var now =new Date();
			var then = new Date(UNIX_timestamp);
			var time="wait";
			var duration = moment.duration(moment(now).diff(then));
			
			var d_year = duration.years();
			var d_month = duration.months();
			var d_week = duration.weeks();
			var d_day = duration.days();
			var d_hrs = duration.hours();
			var d_min =duration.minutes();
			var d_sec = duration.seconds();
			if(d_year>0){
				time = d_year+"y";
			}else if(d_month>0){
				time = d_month+"mo";
			}
			else if(d_week>0){
				time =d_week+"w";
			}else if(d_day>0){
				time = d_day+"d";
			}else if(d_hrs>0){
				time = d_hrs+"h";
			}else if(d_min>0){
				time = d_min+"m";
			}else if(d_sec>0){
				time= d_sec+"s";
			}

			time = time;
			 return time;
}//end translate_time


function isPunctuation(str){
				//return /[.,\/#!$%\^&\*;:{}=\-_`~()]/g.test(str);
				return /[.,\/#!$%\^&\*;:{}=\-`~()]/g.test(str);//exclude _ underscore
			}//end isPunctuation
			function isEmo(s) {
			    return /[^\u0000-\u00ff]/.test(s);
			}//end isEmo
			
			function clean_emoji(string){
				return string.replace(regexAstralSymbols, '');
			}//end  clean_emoji
			function countSymbols(string) {
				return string
					// Replace every surrogate pair with a BMP symbol.
					.replace(regexAstralSymbols, '_')
					// …and *then* get the length.
					.length;
			}//end count symbol


module.exports = router;