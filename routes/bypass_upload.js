var express = require('express');
var chalk = require('chalk');
var path = require('path');
var multer = require('multer');
var crypto = require('crypto');
var image_folder = "./uploads/flash";
var User = require('../models/users');
var Content = require('../models/content');
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
	var msg="";
	upload(req,res,function (err){
		if(err){
			console.log(chalk.red("upload failed "+req.body.caption));	
			msg = err;
		}

		req.files.forEach(function(entry) {
		   // console.log(entry);
		    //console.log(chalk.green("upload success "+(entry).filename+" from ")+(entry).originalname);
		});
		var username = req.body.username;
		var caption = req.body.caption;
		var profile_image = req.files[1].filename;
		var content_filename = req.files[0].filename;
		var email=req.body.email;
		var content_create_at = req.body.createdAt;

		console.log("content_create_at "+content_create_at);

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
			}else if(!docs.length){
				//console.log(chalk.yellow("register first "));
				user.save(function (err, product, numAffected) {
				  if (err) {
				  		console.log(chalk.red("register failed! "));
				  }else if(product){
				  	var content = new Content({
			            caption : caption,
			            filename:content_filename,
			            createdAt:content_create_at+"000",
			            uid:product._id
			        });
			        content.save(function (err, content_data, numAffected) {
			        	if(err){
			        		console.log(chalk.red("save content failed! "));
			        	}else if(content_data){
			        		console.log(chalk.green("post success "+content_data.post_id));
			        		console.log(chalk.yellow("numAffected "+numAffected));
			        	}
			        });
				  }// end else if(product){
				});//end save
			}else if(docs.length){
				console.log(chalk.green("upload.. "));
			}
			 console.log("dog is ",docs);
			 console.log("---------");
		});

		msg = req.body.caption;
		var data ={
			result:'done',
			message:"ba:"+msg
			}
		res.json(data);
	});
	


	
});


module.exports= router;