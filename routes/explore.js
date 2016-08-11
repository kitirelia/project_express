var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Content_Tag = require('../models/content_tag');
var Content = require('../models/content');
var chalk = require('chalk');
var mongoose = require('mongoose');
var moment = require('moment');
var url = require('url');
var path = require('path');
//var ObjectId = require('mongodb').ObjectID;

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
router.use(function timeLog(req, res, next) {
 // console.log('Time: ', Date.now());
// console.log(req.originalUrl);
  next();
});

router.get('/',function (req,res){
	res.json('get ja');
});
router.get('/tags/:tagName',function (req,res){
	var requrl = url.format({
	    protocol: req.protocol,
	    host: req.get('host'),
	    pathname: req.originalUrl,
	});
	//console.log("re "+requrl)
	//var clean_path = requrl.replace("/"+req.params.tagName,"");
	//console.log(requrl.length,"<>",(req.params.tagName).length);
	var clean_path = "http://localhost:3000/explore/tags/";
	//var clean_path = requrl.slice(0,requrl.length-((req.params.tagName).length)-1);
	//console.log(chalk.bgYellow(requrl));
	console.log(chalk.bgCyan(clean_path));
	
	//console.log(chalk.bgGreen(test_str));

	//console.log('params is '+req.params.tagName);
	Content_Tag.find({tag_name:req.params.tagName}, function (err,result) {
		if(err) {
			res.json({res:'Error'+err,
				data:[]
			});
		}else if(result){
			var id_arr = [];
			for(var i=0;i<result.length;i++){
	   			id_arr.push(mongoose.Types.ObjectId(result[i].content_id)); 
	   		}
			//console.log(id_arr);
			Content
		    .find({'_id':{$in:id_arr}})
		    .sort({'createdAt':-1})
		    .populate({path:'owner'})
		    .exec(function(err, doc) {
		      if (err){
		      	console.log(chalk.red('Error'+err));
		      	res.json({res:'Error'+err,
					data:[]
				});
		      }
		      if (doc){
		      	console.log(chalk.green("get doc "+doc.length));
		      	var image_folder = "/uploads/flash/";
		      	var html_str="";
		      	for(var i=0;i<doc.length;i++){
		      		console.log(chalk.yellow("-------"+i+"-------"));
		      		
		      		html_str+="<div>";
		      		html_str+="<h3>"+doc[i].owner.username+"<h3>";
  			 		html_str+='<img src="'+image_folder+doc[i].filename+'" alt="Smiley face" height="100" width="100">';
  			 		html_str+='<img src="'+image_folder+doc[i].owner.profile_image+'" alt="profile" height="100" width="100">';
  			 		html_str+="<div>";
  			 		html_str+=hili_tag(doc[i].caption,clean_path);
  			 		html_str+="<h1>"+readable_time(doc[i].createdAt)+"</h1>";
  			 		html_str+="</div>";
  			 		html_str+="</div>";


		      	}///end for
		      	res.render('view_newfeed',{data:html_str});
		      	//res.json({res:'success',
		      	//		data:doc});
		      }//end if
		    });//end Content.find({'_id':{$in:id_arr}})
		}
	});
	
});//end ('/get')

function hili_tag(str,url){
			var html_str="<div class='space'>";
			var found=false;
			var buffering =false;
			var buffer_text="";
			var found_index=0;
			var flag_arr=['#','@'];
			var prefix="";
			var path ="";
						
			for(var i=0;i<str.length;i++){
				if(flag_arr.indexOf(str.charAt(i))>=0){
					prefix=flag_arr[flag_arr.indexOf(str.charAt(i))];
					if(prefix==="#"){
						path =url;
					}else if(prefix!="#"){
						path ="";
					}
					if(!buffering){	
						buffering=true;
						buffer_text="";
						found_index=i;
					}else if(buffering){
						html_str+='<a href="'+path+(buffer_text.toLowerCase().trim())+'/">'+prefix+buffer_text+'</a>';
						buffer_text="";
						found_index=i;
					}
				}
				if(buffering){
					if((isEmo(str.charAt(i)) || isPunctuation(str.charAt(i)) || str.charAt(i)==" " || i>=str.length-1) && i>found_index ){
						//console.log('case to end '+str.charAt(i),i);
						var end_str="";
						if(!(i>=str.length-1)|| !(isPunctuation(str.charAt(i))) ){
							buffer_text+=str.charAt(i);
						}
						html_str+='<a href="'+path+(buffer_text.toLowerCase().trim())+'/">'+prefix+buffer_text+'</a>'+end_str;
						buffer_text="";
						buffering=false;
					}else{
						if(str.charAt(i)!=="#" && str.charAt(i)!=="@")buffer_text+=str.charAt(i);
					}
				}
				else if(!buffering){
					html_str+=str.charAt(i);
				}
			}
			//console.log(html_str);
			return html_str+'</div>';
}//end hilitag
function readable_time(UNIX_timestamp) {
			var now =new Date();
			var then = new Date(UNIX_timestamp);
			var time="wait";
			var duration = moment.duration(moment(now).diff(then));
			
			var d_year = duration.years();
			var d_month = duration.months();
			var d_week = duration.weeks();
			var d_day = duration.days();
			var d_hrs = duration.hours();
			var d_min =duration.minutes();
			var d_sec = duration.seconds();
			if(d_year>0){
				time = d_year+"y";
			}else if(d_month>0){
				time = d_month+"mo";
			}
			else if(d_week>0){
				time =d_week+"w";
			}else if(d_day>0){
				time = d_day+"d";
			}else if(d_hrs>0){
				time = d_hrs+"h";
			}else if(d_min>0){
				time = d_min+"m";
			}else if(d_sec>0){
				time= d_sec+"s";
			}

			time = time;
			 return time;
}//end translate_time


function isPunctuation(str){
				//return /[.,\/#!$%\^&\*;:{}=\-_`~()]/g.test(str);
				return /[.,\/#!$%\^&\*;:{}=\-`~()]/g.test(str);//exclude _ underscore
			}//end isPunctuation
			function isEmo(s) {
			    return /[^\u0000-\u00ff]/.test(s);
			}//end isEmo
			
			function clean_emoji(string){
				return string.replace(regexAstralSymbols, '');
			}//end  clean_emoji
			function countSymbols(string) {
				return string
					// Replace every surrogate pair with a BMP symbol.
					.replace(regexAstralSymbols, '_')
					// …and *then* get the length.
					.length;
			}//end count symbol


module.exports = router;