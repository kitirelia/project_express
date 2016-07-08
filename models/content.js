
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
	uid:String,
	createdAt: {
        type: Date,
        required: false,
        default: Date.now
     }
	//create_date:{Date,timestamps: true} 
});
contentSchema.plugin(autoIncrement.plugin,{model:'content_data' ,field: 'post_id'});
contentSchema.set('collection', 'content_data');

var Content = mongoose.model('content_data',contentSchema);

module.exports = Content;