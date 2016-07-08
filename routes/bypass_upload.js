var express = require('express');
var chalk = require('chalk');
var path = require('path');
var multer = require('multer');
var crypto = require('crypto');
var image_folder = "./uploads/flash/";
var User = require('../models/users');
var Content = require('../models/content');
var fs = require('fs');
var router = express.Router();


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

		var user = new User({
		  name: username,
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
				  		console.log(chalk.red("register failed! "));
				  		send_resp(res,"Error","auto resgister fail");
				  }else if(product){//user exist
				  	console.log('register success');
				  	upload_content(res,caption,content_filename,content_create_at,product._id);
				  }// end else if(product){
				});//end save
			}else if(docs.length){
				console.log('skip register');
				console.log("here "+docs.length);
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
			// console.log("dog is ",docs);
			 //console.log("---------");
		});
	});	
});// end /post

function upload_content(res,caption,content_filename,content_create_at,uid){
	var content = new Content({
			caption : caption,
			filename:content_filename,
			createdAt:content_create_at+"000",
			uid:uid
	});
	content.save(function (err, content_data, numAffected) {
		if(err){
			console.log(chalk.red("save content failed! "));
			send_resp(res,"Error","upload content fail");
		}else if(content_data){
			console.log(chalk.green("post success "+content_data.post_id));
			console.log(chalk.yellow("numAffected "+numAffected));
			send_resp(res,"Success","upload content success "+content_data.post_id);
		}
	});
}

function send_resp(res,msg,detial){
	var data ={
	result:msg,
		message:detial
	}
	res.json(data);
}

module.exports= router;