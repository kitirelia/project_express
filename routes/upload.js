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
         //console.log(chalk.magenta("check time "+req.body.create_date));
          //console.log(req.body.create_date);
         var tmp_create_at=(req.body.create_date.trim())+"000";
          //console.log(chalk.magenta("trim|"+tmp_create_at+"|",tmp_create_at.length));
         if(tmp_create_at ===null || tmp_create_at===undefined ||tmp_create_at.length<1){
            tmp_create_at=Math.round(+new Date());
            console.log(chalk.yellow("create self timestamp ",tmp_create_at));
         }
         //console.log(chalk.cyan("before add  "+tmp_create_at));
         var content = new Content({
            caption : req.body.caption,
            filename:req.file.filename,
            createdAt:tmp_create_at
        });
        content.save(function (err){
          //console.log(chalk.white("obj time is ",this.create_date));
          if(err){
            console.log(chalk.red('Save data error.'));
             result_str="error";
             msg='Save data error';
          }
            
          
          //console.log(chalk.green('Save data Success ',this.create_date));
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