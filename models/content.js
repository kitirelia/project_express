
var mongoose = require('mongoose');
var chalk = require('chalk');
var autoIncrement = require('mongoose-auto-increment');

mongoose.connect('localhost:27017/arsenal_db');
//mongoose.set('debug', true);
mongoose.connection.on('open', function (ref) {
	console.log(chalk.green('content Connected to mongo server.'));
});

mongoose.connection.on('error', function (err) {
 	console.log(chalk.red('content Error to mongo server.'));
 	 console.log(err);
});
autoIncrement.initialize(mongoose.connection);

var Schema = mongoose.Schema;



var contentSchema = new Schema({
	post_id:Number,
	caption:String,
	filename:String,
	uid:{type:String,required:true},
	createdAt: {
        type: Date,
        required: false,
        default: Date.now
     },
     tag_arr:[],
     other_user:[]
	//create_date:{Date,timestamps: true} 
});
contentSchema.plugin(autoIncrement.plugin,{model:'content_data' ,field: 'post_id'});
contentSchema.set('collection', 'content_data');

contentSchema.methods.check_TagExist = function(cb){
	return 'hey';
  //return this.model('user_data').find({ username: this.username }, cb);
};

var Content = mongoose.model('content_data',contentSchema);
module.exports = Content;