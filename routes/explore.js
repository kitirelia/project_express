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
///////////////// modal content  //////////////////
///////////////////////////////////////////////////
router.get('/modal/:id',function (req,res){
	//console.log('id '+req.params.id);
	var requrl = url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: req.originalUrl,
	});

	var base_url = requrl;
	var image_folder = "/uploads/flash/";
	var owner_username = "b_lank";
	var owner_fullname="";
	var owner_image="";
	var check_index=base_url.indexOf('modal/'+req.params.id);
	var other_tag_path = base_url.substring(0,(check_index))+"tags/";
	var nav_to_person = base_url.substring(0,(check_index))+"person/";
	Content
	.findOne({'_id':req.params.id},function (err,doc){
		if(err){
			console.log(chalk.red("findOne Error "+err));
			res.json({
				stat:'error',
				data:[]
			});
		}else{
			if(doc){
				//console.log(chalk.green('found content'));
			//	console.log(chalk.bgGreen(doc));
				var caption_html=hili_tag(doc.caption,other_tag_path);
				var create_time = readable_time(doc.createdAt);
				var image_file=image_folder+doc.filename;
				User
				.findOne({'_id':doc.owner},function (err,user){
					if(err){
						res.json({
							stat:'error',
							data:[]
						});
					}else if(user){
						owner_username =  user.username;
						nav_to_person = nav_to_person+user.username;
						owner_fullname = user.name;

						owner_image = image_folder+user.profile_image;

						if(caption_html=='null'){
							caption_html="";
						}else if(caption_html!='null'){
							caption_html = owner_username+" "+caption_html;
						}
						res.json({
							stat:'ok',
							owner_data:{
								username:owner_username,
								nav_data :nav_to_person,
								fullname:owner_fullname,
								profile:owner_image
							},
							content:{
								caption:caption_html,
								time:create_time,
								image:image_file
							}
						});
						//console.log(chalk.cyan(user));
					}
				});
			}
		}
	});	
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
	var requrl = url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: req.originalUrl,
	});

	var base_url = requrl;
	var check_index=base_url.indexOf(req.params.userName);
	var other_tag_path = base_url.substring(0,(check_index));
	base_url=base_url.substring(0,(check_index+req.params.userName.length))+"/";
  	var next_url=base_url;
	var max_id = 0;
	var num_limit =15;
	var start_index=0;
	var next_url=base_url;
	if(req.query.limit){
		num_limit = Number(req.query.limit);
		//console.log(chalk.green("get max_id: "+num_limit));
	}
	if(req.query.start_index){
		start_index = Number(req.query.start_index);
		//console.log(chalk.green("start index: "+start_index));
	}
	if(req.query.max_id){
		//console.log(chalk.yellow('get '+req.query.max_id));
		max_id = Number(req.query.max_id);
		max_id=max_id+=1;
		next_url = next_url+"?max_id="+max_id;
	}else if(!req.query.max_id){
		next_url = next_url+"?max_id=0";
	}
	//console.log("next ulr "+next_url);
	var search_name = (req.params.userName).replace(/\s/g, "") ;
	User
	.findOne({'username':search_name},function (err,doc){
		if(err){
			console.log(chalk.red("findOne Error "+err));
		}else{
			if(doc){
				//console.log(doc);
				//var all_tag_post = doc.length;
				
				var profile_picture="";
				var image_folder = "/uploads/flash/";
				profile_picture = image_folder+doc.profile_image;
				var nick_name= doc.name;
				var all_tag_post  =0;
				Content
				.find({'owner':doc._id})
				.populate({path:'owner'})
				.exec(function (err,all_content){
					if(err){
						console.log(chalk.red('cannot count '+err));
					}else{
						all_tag_post = all_content.length;
					//	console.log('all post of '+req.params.userName+" totals "+all_tag_post);
						Content
						.find({'owner':doc._id})
						.populate({path:'owner'})
						//.limit(15)
						.skip(max_id*num_limit)
		    			.limit(num_limit)
						.exec(function (err,result){
							if(err){
								console.log(chalk.red('populate content err '+err));
							}else if(result){
								for(var i=0;i<result.length;i++){
									result[i].filename=image_folder+result[i].filename;
								}
								var has_next_page=false;
								var current_doc  = all_tag_post-((max_id*num_limit)+num_limit);
						      	//console.log('all_tag_post '+all_tag_post,"skip ",(max_id*num_limit)," current_doc "+current_doc," doc "+doc.length);
						      	if(current_doc>0){
						      		has_next_page=true;
						      	}else if(current_doc<=0){
						      		has_next_page=false;
						      	}
								console.log(chalk.cyan('-------------------- '+has_next_page));
								if(req.query.max_id){
									res.json({
										 msg:'success',
									 	profile_img:profile_picture,
									 	user_name:search_name,
									 	all_post:all_tag_post,
									 	followers:0,
									 	following:0,
									 	nickname:nick_name,
									 	has_next:has_next_page,
									 	next_page:next_url,
									 	data:result
									 });
								}//end if(req.query.max_id)
								else if(!req.query.max_id){
									res.render('view_person',{
									 	msg:'success',
									 	profile_img:profile_picture,
									 	user_name:search_name,
									 	all_post:all_tag_post,
									 	followers:0,
									 	following:0,
									 	nickname:nick_name,
									 	has_next:has_next_page,
									 	next_page:next_url,
									 	data:result
								 		});
									}//end !req.query.max_id
								}//end else if(!req.query.max_id)
						});
					}//end count content
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
	 console.log('-------------- show_personal_page');
}


///////////////////////////////////////////////////
///////////////// tags/tagName  ///////////////////
///////////////////////////////////////////////////

router.get('/tags/:tagName',function (req,res){
	var requrl = url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: req.originalUrl,
	});
	var base_url = requrl;
	var check_index=base_url.indexOf(req.params.tagName);
	var other_tag_path = base_url.substring(0,(check_index));
	base_url=base_url.substring(0,(check_index+req.params.tagName.length))+"/";
  	var next_url=base_url;
	var max_id = 0;
	var num_limit =15;
	var start_index=0;
	if(req.query.limit){
		num_limit = Number(req.query.limit);
		//console.log(chalk.green("get max_id: "+num_limit));
	}
	if(req.query.start_index){
		start_index = Number(req.query.start_index);
		//console.log(chalk.green("start index: "+start_index));
	}
	if(req.query.max_id){
		//console.log(chalk.yellow('get '+req.query.max_id));
		max_id = Number(req.query.max_id);
		max_id=max_id+=1;
		//console.log(chalk.bgYellow('set '+max_id));
		next_url = next_url+"?max_id="+max_id;
		//console.log(chalk.cyan('JSON '+next_url));
	}else if(!req.query.max_id){
		next_url = next_url+"?max_id=0";
		//console.log(chalk.red('-------render page'));
	}
	
	//console.log(base_url,'==',other_tag_path);
	console.log(chalk.yellow('max_id ',max_id," num_limit "+num_limit,' skip '+(max_id*num_limit)));
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
	   		var all_tag_post = result.length;
			Content
		    .find({'_id':{$in:id_arr}})
		    .skip(max_id*num_limit)
		    .limit(num_limit)
		    .sort({'createdAt':-1})
		    .populate(
		    	{
		    		path:'owner'
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
		      	var has_next_page =false;
		      	var current_doc  = all_tag_post-((max_id*num_limit)+num_limit);
		      	//console.log('all_tag_post '+all_tag_post,"skip ",(max_id*num_limit)," current_doc "+current_doc," doc "+doc.length);
		      	if(current_doc>0){
		      		has_next_page=true;
		      	}else if(current_doc<=0){
		      		has_next_page=false;
		      	}
		      	//console.log(chalk.green(req.params.tagName," get doc: "+doc.length," has next "+has_next_page));
		      	//console.log(chalk.green(" -------------- "));
		      	var image_folder = "/uploads/flash/";
		      	var html_str="";
		      	for(var i=0;i<doc.length;i++){
		      		//console.log(doc[i]);
		      		doc[i].caption=hili_tag(doc[i].caption,other_tag_path);
		      		doc[i].filename=image_folder+doc[i].filename;
		      	}///end for

					//res.json(result);
				if(req.query.max_id){
					res.json({
						 	msg:'success',
						 	hashtag_name:req.params.tagName,
						 	all_post:all_tag_post,
						 	next_page:next_url,
						 	has_next:has_next_page,
						 	data:doc
					 });
				}
				else if(!req.query.max_id){
			      	res.render('view_tag',{
						 	msg:'success',
						 	hashtag_name:req.params.tagName,
						 	all_post:all_tag_post,
						 	next_page:next_url,
						 	has_next:has_next_page,
						 	data:doc
					 });
		      	}	
		      }//end if
		    });//end Content.find({'_id':{$in:id_arr}})
		}
	});
	
});//end ('/get')

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
router.get('/debugaaaaaaaaaaaa/:tagName/:max_id?',function (req,res){
	
});

router.get('/where',function (req,res){
	var requrl = url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: req.originalUrl,
	});
	console.log(requrl);
	res.json({});
});

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
						//console.log('path here '+path);
					}else if(prefix!="#"){
						path ="http://www.instagram.com/";
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