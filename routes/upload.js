var express = require('express');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var router = express.Router();
var storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
});

var upload = multer({ storage: storage });
// var upload = multer({dest:'./uploads/xxx',
// 	rename: function(fieldname, filename) {
//         return Date.now()+".jpg";
//     }
// });

router.get('/', function(req, res) {
  console.log('GET upload page');
  res.send('Hello');
}); 

router.post('/', upload.single('avatar'),  function(req, res) {
 	console.log('file name  '+req.file.filename);
 	console.log('caption '+req.body.caption)
  //console.log(req.file);
	res.send('Successfully uploaded!');
});

module.exports = router;