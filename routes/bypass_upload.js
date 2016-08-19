var express = require('express');
var chalk = require('chalk');
var path = require('path');
var multer = require('multer');
var crypto = require('crypto');
var image_folder = "./uploads/flash/";
var User = require('../models/users');
var Content = require('../models/content');
var Tag = require('../models/tags');
var Content_Tag = require('../models/content_tag');
var fs = require('fs');
var router = express.Router();
var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

var all_progress = 3;
var current_progress=0;
var  cache_resp={};

var storage = multer.diskStorage({
  destination: image_folder,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })}
});//end storage

var upload = multer({ storage: storage }).array('photo',2);

router.get('/',function (req,res){
	res.send('this is bypass');
});
router.post('/',function (req,res){
	//var msg="";
	current_progress = 0;
	upload(req,res,function (err){
		if(err){
			console.log(chalk.red("upload failed "+req.body.caption));	
			send_resp("Error","upload image fail");
		}
		var username = req.body.username;
		var caption = req.body.caption;
		var profile_image = req.files[1].filename;
		var content_filename = req.files[0].filename;
		var email=req.body.email;
		var content_create_at = req.body.createdAt;
		var full_name = req.body.fullname;
		console.log('debug ',"user "+username);
		var user = new User({
		  name: full_name,
		  username: username,
		  password: "aaa",
		  email: username+"@flash_routes.com",
		  profile_image:profile_image
		});
		user.checkExist(function(err,docs){
			if(err) {
				console.log('error method');
				send_resp(req,"Error","check user exist fail");
			}else if(!docs.length){
				console.log(chalk.yellow("register first "));
				user.save(function (err, product, numAffected) {
				  if (err) {
				  		console.log(chalk.red("register failed! "+err));
				  		send_resp(res,"Error","auto resgister fail");
				  }else if(product){//user exist
				  	console.log('register success');
				  	upload_content(res,caption,content_filename,content_create_at,product._id);
				  }// end else if(product){
				});//end save
			}else if(docs.length){
				var delete_path = " ../../"+image_folder+profile_image;
				console.log(chalk.magenta("try delete  "+delete_path));
				fs.exists(delete_path, function(exists) {
				  if(exists) {
				    //Show in green
				    console.log(chalk.green('File exists. Deleting now ...'));
				    fs.unlink(delete_path);
				  } else {
				    //Show in red
				    console.log(chalk.red('File not found, so not deleting.'));
				  }
				  var uid = docs[0]._id;
					console.log(chalk.cyan("xxxuid.. "+uid));
					upload_content(res,caption,content_filename,content_create_at,uid);
				});//end fs.exist
			}
		});
	});	
});// end /post

function upload_content(res,caption,content_filename,content_create_at,uid){
	console.log(chalk.bgYellow('start upload id is '+uid));
	var tag_Arr=search_tag(caption);
	var user_arr=search_user(caption);
	var content = new Content({
			caption : caption,
			filename:content_filename,
			createdAt:content_create_at+"000",
			owner:uid,
			tag_arr:tag_Arr,
			other_user:user_arr
	});
	content.save(function (err, content_data, numAffected) {
		if(err){
			console.log(chalk.bgRed("save content failed! "+err));
			send_resp(res,"Error","upload content fail");
		}else if(content_data){
			//console.log(chalk.green("post success "+content_data));
			//console.log(chalk.yellow("numAffected "+numAffected));
			//result_content_id = content_data._id;
			//console.log('owner '+content.owner)
			//console.log(chalk.bgGreen('content save ! '+content_data._id));
			update_hashtag_data(tag_Arr,content.owner,content_data._id);
			send_resp(res,"Success","upload content success "+content_data._id);
			//pair_content_with_tag(content_data.post_id,tag_Arr);
		}
	});
}

function pair_content_with_tag(arr){
	//console.log('to pair '+arr);
	//console.log('get id '+_content_id,arr);
	var start_index = 0;
	pair_each(arr[start_index]);
	function pair_each(tag_data){
	//	console.log('call pair  each');
		var content_tag = new  Content_Tag({
			content_id :tag_data[2],
			tag_id: tag_data[0],
			tag_name : tag_data[1]
		}); 
		content_tag.save(function (err,doc, numAffected){
			if(err){
				console.log(chalk.red(i,'Error! paring tag content '));
			}else if(doc){
				//console.log('paring okay! '+doc);
				start_index++;
				if(start_index<arr.length){
					pair_each(arr[start_index]);
				}
				else{
					//console.log(chalk.bgGreen('Paring Done'));
					all_done(null,null);
				}
			}
		});
	}
	
}

function update_hashtag_data(arr,founder_id,content_id){
	var start_index = 0;
	var tag_to_pair=[];
	save_each_tag(arr[start_index]);
	function save_each_tag(str){
		var tag = new Tag({
			name:str,
			founder:founder_id
		});
		tag.check_TagExist(function (err,doc){
			if(err){
				console.log(chalk.red(i,'Error! checking.. tag '+str));
			}else if(!doc.length){
				//console.log(chalk.bgYellow('start saving tag '+str));
				tag.save(function (err, product, numAffected) {
				  if (err) {
				  		console.log(chalk.red("save fail! "));
				  }else if(product){//user exist
				  	//console.log(chalk.bgGreen('tag '+str+' save! id '+product._id,"founder is "+product.founder));
				  	tag_to_pair.push([product._id,product.name,content_id]);
				  }// end else if(product){
				  	start_index++;
				  	if(start_index<arr.length){
				  		//console.log(chalk.yellow("save more ",start_index,arr.length));
				  		save_each_tag(arr[start_index]);
					}else{
						all_done(null,null);
						pair_content_with_tag(tag_to_pair);
						//console.log("before pair");
						//console.log(tag_to_pair);
						//console.log(chalk.yellow("done with ",start_index,arr.length));
						//console.log(chalk.bgGreen('All done'));
					}
				});//end save
			}else if(doc.length){
				//console.log(chalk.bgCyan('this tag exist '+str+" id is "+doc[0]));
				//console.log(chalk.bgRed('this tag exist '+str+" id is "+doc[0]._id,doc[0].name));
				tag_to_pair.push([doc[0]._id,doc[0].name,content_id]);
				start_index++;
				if(start_index<arr.length){
					//console.log(chalk.yellow("save more ",start_index,arr.length));
					save_each_tag(arr[start_index]);
				}else{
					all_done(null,null);
					pair_content_with_tag(tag_to_pair);
					//console.log("before pair");
					//	console.log(tag_to_pair);
					//console.log(chalk.bgGreen('All done'));
				}
			}
		});
	}
}

function send_resp(res,msg,detial){
	var data ={
		result:msg,
		message:detial
	}
	var arr = [msg,detial];
	//res.json(data);
	all_done(arr,res);
}


function all_done(data,response){
	var resp_data = {};
	if(data!=null){
		//var resp_data ="";
			cache_resp = {
			result:data[0],
			message:data[1]
		};
		//console.log("debug inside "+resp_data.result);
		res = response;
	//	console.log('res is '+res,resp_data);
	}
	current_progress++;

	//console.log(chalk.yellow("now progress ",current_progress,"/",all_progress));
	if(current_progress==all_progress){
		console.log(chalk.bgGreen('All done resp here'));
		res.json(cache_resp);
		//console.log('res is '+res,cache_resp);
		//console.log("debug "+cache_resp.result);
	}
}

function search_tag(str){
	var found=false;
	var buffering =false;
	var buffer_text="";
	var found_index=0;
	var flag_arr=['#','@'];
	var prefix="";
	var user_arr=[];
	var tag_arr=[];
		
	for(var i=0;i<str.length;i++){
		if(flag_arr.indexOf(str.charAt(i))>=0){
			prefix=flag_arr[flag_arr.indexOf(str.charAt(i))];
			if(!buffering){	
				buffering=true;
				buffer_text="";
				found_index=i;
			}else if(buffering){
				if(prefix==="#"){
					tag_arr.push(((buffer_text).trim()).toLowerCase());
				}
				else if(prefix!="#"){
					user_arr.push(buffer_text.trim());
				}
				buffer_text="";
				found_index=i;
			}
		}
		if(buffering){
			if((isEmo(str.charAt(i)) || isPunctuation(str.charAt(i)) || str.charAt(i)==" " || i>=str.length-1) && i>found_index ){
				var end_str="";
				if(!(i>=str.length-1)|| !(isPunctuation(str.charAt(i))) ){
					buffer_text+=str.charAt(i);
				}
				if(prefix==="#"){
					tag_arr.push(((buffer_text).trim()).toLowerCase());
					//tag_arr.push(buffer_text.trim());
				}
				else if(prefix!="#"){
					user_arr.push(buffer_text.trim());
				}
				buffer_text="";
				buffering=false;
				}else{
					if(str.charAt(i)!=="#" && str.charAt(i)!=="@")buffer_text+=str.charAt(i);
				}
			}
			else if(!buffering){
						
			}
	}//end for	
	return tag_arr;	
}//search_user_tag
function search_user(str){
	var found=false;
	var buffering =false;
	var buffer_text="";
	var found_index=0;
	var flag_arr=['#','@'];
	var prefix="";
	var user_arr=[];
	var tag_arr=[];
		
	for(var i=0;i<str.length;i++){
		if(flag_arr.indexOf(str.charAt(i))>=0){
			prefix=flag_arr[flag_arr.indexOf(str.charAt(i))];
			if(!buffering){	
				buffering=true;
				buffer_text="";
				found_index=i;
			}else if(buffering){
				if(prefix==="#"){
					tag_arr.push((buffer_text).trim());
				}
				else if(prefix!="#"){
					user_arr.push(buffer_text.trim());
				}
				buffer_text="";
				found_index=i;
			}
		}
		if(buffering){
			if((isEmo(str.charAt(i)) || isPunctuation(str.charAt(i)) || str.charAt(i)==" " || i>=str.length-1) && i>found_index ){
				var end_str="";
				if(!(i>=str.length-1)|| !(isPunctuation(str.charAt(i))) ){
					buffer_text+=str.charAt(i);
				}
				if(prefix==="#"){
					tag_arr.push(buffer_text.trim());
				}
				else if(prefix!="#"){
					user_arr.push(buffer_text.trim());
				}
				buffer_text="";
				buffering=false;
				}else{
					if(str.charAt(i)!=="#" && str.charAt(i)!=="@")buffer_text+=str.charAt(i);
				}
			}
			else if(!buffering){
						
			}
	}//end for	
	return user_arr;	
}//search_user

function isPunctuation(str){
				//return /[.,\/#!$%\^&\*;:{}=\-_`~()]/g.test(str);
	return /[.,\/#!$%\^&\*;:{}=\-`~()]/g.test(str);//exclude _ underscore
}
function isEmo(s) {
	 return /[^\u0000-\u00ff]/.test(s);
}
			
function clean_emoji(string){
	return string.replace(regexAstralSymbols, '');
}
function countSymbols(string) {
	return string
					// Replace every surrogate pair with a BMP symbol.
	.replace(regexAstralSymbols, '_')
					// …and *then* get the length.
	.length;
}//end count symbol

module.exports= router;