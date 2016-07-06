var express = require('express');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var router = express.Router();
var image_folder = "./uploads/";



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
  res.send('Hello');
}); 

router.post('/',  function(req, res) {
  //console.log('debug caption '+req.body.caption);
	upload(req,res,function (err){
    console.log("is files "+req.file, "caption "+req.caption);
    console.log('---------');
    console.log('track usernaem '+req.body.username);
     console.log('track caption '+req.body.caption);
    //console.log(req);
    console.log('---------');
    var result_str = "";
    var msg="";
		if(err){
			return result_str="error";
		}else{
      if(req.file){
        result_str="success";
        msg='ok';
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
      //res.json(aa);
    //  console.log("req "+req.body.caption);
    }
	});


	
});

module.exports = router;