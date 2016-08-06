var express= require('express');
var chalk = require('chalk');
var router = express.Router();
var bodyParser = require('body-parser');
var model = require('../models/test_content');
var Person = model.Person;
var Story = model.Story;
var add_index = 0;
var Content = require('../models/content');

router.use(function timeLog(req, res, next) {
 // console.log('Time: ', Date.now());
  next();
});


router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

function isObject(val) {
    return (typeof val === 'object');
}
router.get('/',function (req,res){
	console.log('get method');
	Content.find({owner:'57a5ac48e4b68bb42ad93d3ax'}).populate('owner').exec(function (err, cb) {
	  	if (err){
	  		console.log('err '+err);
	  		res.json({res:'get'+err});
	  	}//else{
	  	if(cb){
	  		console.log('it cb');
	  		//if(cb.length){
	  		//	console.log('get data');
	  		//}else{
	  			console.log('no data');
	  		//}
	  		//res.json({res:'owner is '});
	  	}else if(!cb){
	  		console.log('!!!cb');
	  		//res.json({res:'no data'});
	  	}
	  		//res.json({res:'The creator is %s'+story._creator.name});
	  		//console.log("all data "+cb.length,(cb==[]));
	  		
	  		//console.log('is obj '+isObject(cb));
	  		///console.log('cb is '+cb[0].owner);
	  		//console.log('owner '+cb.user_name);
	  		//console.log('image path '+cb.owner.profile_image);
	  		//res.json({res:'owner is '});
	  	//}
  	});
	
});
router.put('/',function (req,res){
	Story.findOne({ title:'Once upon a timex.3' }).populate('_creator').exec(function (err, story) {
	//Story.findOne({ title: 'Once upon a timex.' }).populate('_creator').exec(function (err, story) {
	  	if (err){
	  		res.json({res:'get'+err});
	  	}else{
	  		//res.json({res:'The creator is %s'+story._creator.name});
	  		console.log('get id '+story._creator.user_name);
	  		res.json({res:'The creator is %s'+story.user_name});
	  	}
  	});
});
router.post('/',function (req,res){

	console.log('post method '+add_index);
	
	//var aaron = new Person({ _id: add_index, name: 'Aaron'+add_index.toString(), age: 100 });
	var user_email ="mr_arron"+add_index.toString()+"@gmail.com";
	var u_name  ="user_name_of_arron"+add_index.toString();
	var aaron = new Person({ 
		name: 'Aaron'+add_index.toString(),
		user_name :u_name,
		email:user_email,
		age: 100 
	});
	aaron.save(function (err,obj) {
	  if (err){
	  	console.log(chalk.red('arron not ok!! '+err));
	  	res.json({res:'error '+err});
	  }else{
	  	 console.log(chalk.yellow('arron ok '+obj.id));
		  var story1 = new Story({
		    title: "Once upon a timex."+add_index.toString(),
		    _creator: aaron._id,
		    user_name:aaron.user_name
		  });
		  
		  story1.save(function (err) {
		    if (err){
		    	console.log(chalk.red('story not ok!! '+err));
		    } else{
		    	 // thats it!
		   	 	console.log(chalk.green('save!'));
		    	res.json({res:'post success '+aaron._id});	
		    	add_index++;
		    }
		  });
	  }
	});
});
	


module.exports = router;