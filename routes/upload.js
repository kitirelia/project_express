var express = require('express');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var router = express.Router();
var image_folder = "./uploads/"
var storage = multer.diskStorage({
  destination: image_folder,
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })}
});//end storage

//var upload = multer({ storage: storage }); //work fine
var upload = multer({ storage: storage }).single('avatar');

router.get('/', function(req, res) {
  console.log('GET upload page');
  res.send('Hello');
}); 

//router.post('/', upload.single('avatar'),  function(req, res) {//work fine!
router.post('/',  function(req, res) {
	upload(req,res,function (err){
		if(err){
			return;
		}
		res.send('uploaded!');
	});
 	//console.log('file name  '+req.file.filename);
 	//console.log('caption '+req.body.caption)
  //console.log(req.file);
	
});

module.exports = router;