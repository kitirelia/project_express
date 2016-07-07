var express = require('express');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var router = express.Router();
var image_folder = "./uploads/";
var Content = require('../models/content');
var chalk = require('chalk');


var storage = multer.diskStorage({
  destination: image_folder,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })}
});//end storage
var file_filter;

var upload = multer({ storage: storage }).single('this_image');


router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.get('/', function(req, res) {
  console.log('GET upload page');
  res.json({});
}); 

router.post('/',  function(req, res) {
  //console.log('debug caption '+req.body.caption);
	upload(req,res,function (err){
    //console.log('track usernaem '+req.body.username);
    //console.log('track caption '+req.body.caption);
    var result_str = "";
    var msg="";
		if(err){
			return result_str="error";
		}else{
      if(req.file){
         console.log(chalk.cyan(req.file.filename));
         var create_at="";
        var content = new Content({
            caption : req.body.caption,
            filename:req.file.filename,
            create_date:create_at
        });
        content.save(function (err){
          if(err){
            console.log(chalk.red('Save data error.'));
             result_str="save fial";
             msg='Save data error';
          }
          console.log(chalk.green('Save data Success'));
           result_str="save success";
           msg='ok';
        });//end save

        // result_str="success";
        // msg='ok';
      }
      else{
        result_str="error";
        msg='no file'
      }
      var data = { 
        result:result_str,
        message:msg
    }
      res.json(data);
    }
  });


	
});

module.exports = router;