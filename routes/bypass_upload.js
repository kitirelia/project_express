var express = require('express');
var chalk = require('chalk');
var path = require('path');
var multer = require('multer');
var crypto = require('crypto');
var image_folder = "./uploads/flash";
var router = express.Router();


var storage = multer.diskStorage({
  destination: image_folder,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })}
});//end storage


//var upload = multer({ storage: storage }).single('this_image');
// app.post('/profile', upload.single('avatar'), function (req, res, next) {
  
// })
var upload = multer({ storage: storage }).array('photo',2);
//app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
//})

router.get('/',function (req,res){
	res.send('this is bypass');
});
router.post('/',function (req,res){
	upload(req,res,function (err){
		if(err){
			console.log(chalk.red("upload failed "+req.body.caption));	
		}
		console.log(chalk.magenta("found caption "+req.body.caption));
	});
	


	var data ={result:'done',
				message:"ba:"+req.body.caption
				}
	res.json(data);
});


module.exports= router;