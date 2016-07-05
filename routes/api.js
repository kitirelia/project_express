// var express = require('express');

// var bodyParser = require('body-parser');
// var gutil = require('gulp-util');
// var chalk = require('chalk');
// var Bear = require('../models/bear');
// var router = express.Router();
// router.use(function(req, res, next) {
//   // .. some logic here .. like any other middleware
//   console.log("use here "+req.method, req.url);
//   next();
// });
// var mongoose = require('mongoose');
// mongoose.connect('localhost:27017/arsenal_db');

// mongoose.connection.on('open', function (ref) {
// 	console.log(gutil.colors.green('Connected to mongo server.'));
// });

// mongoose.connection.on('error', function (err) {
//  console.log(gutil.colors.red('Connected to mongo server.'));
//   console.log(err);
// });


// router.get('/', function(req, res) {
//   console.log(chalk.white.bgGreen.bold('GET api page'));
// 	Bear.find(function(err, bears) {
//             if (err){
//             	res.send(err);
//             }
//             res.json(bears);
//     });
//  // res.json({ message: 'hooray! welcome to our api! '+req.body.caption });   
// }); 

// //----- search by id
// router.get('/:bear_id', function(req, res) {
//   //console.log(chalk.cyan.bgGreen.bold('search '+req.params.bear_id));
// 	Bear.findById(req.params.bear_id, function(err, bear) {
//         if (err)
//                 res.send(err);
//             res.json(bear);
//         });
// }); 

// ///----------- insert 
// router.post('/',function (req,res){
// 	var bear = new Bear();
// 	bear.name= req.body.name;
// 	bear.surname = req.body.surname;
// 	bear.Age = req.body.Age;
// 	bear.Position = req.body.Position;
// 	bear.Position = req.body.Position;
// 	bear.SquadNumber=req.body.SquadNumber;
// 	bear.PreviousClub = req.body.PreviousClub;
// 	bear.profile_image = req.body.profile_image;
// 	console.log(chalk.white.bgYellow.bold('POST api page'));
// 	// save the bear and check for errors
//     bear.save(function(err) {
//     	if (err){
//     		res.send(err);
//     	}
//             res.json({ message: 'Bear created!' });
//         });
// 	//res.json({ message: 'post!'+bear });  
// });

// //-------------- update
// router.put('/:bear_id',function (req,res){
// 	console.log(chalk.white.bgCyan.bold('PUT update'));
// 	//res.json({ message: 'put' });  
// 	Bear.findById(req.params.bear_id, function(err, bear) {

//             if (err){
//             	res.send(err);
//             }
                

//             bear.name = req.body.name;  // update the bears info

//             // save the bear
//             bear.save(function(err) {
//                 if (err)
//                     res.send(err);
//                 console.log(chalk.white.bgCyan.bold('Bear updated!'));
//                 res.json({ message: 'Bear updated!' });
//             });

//         });
// });
// router.delete('/:bear_id',function (req,res){
// 	console.log(chalk.white.bgRed.bold('DELTE data'));
// 	Bear.remove({
//             _id: req.params.bear_id
//         }, function(err, bear) {
//             if (err){
//                 console.log("ERROR");
//                 //res.send(err);
//                 res.send(err);
//             }else{
//                 console.log("else ");
//                 res.json({ message: 'Successfully deleted' });
//             }
            
//         }); 
// });

// module.exports = router;