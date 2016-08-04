var mongoose = require('mongoose');
var chalk = require('chalk');

var Schema = mongoose.Schema;

var tagSchema = new Schema({
	name:String,
	createdAt: {
        type: Date,
        required: false,
        default: Date.now
     }
	//create_date:{Date,timestamps: true} 
});
tagSchema.set('collection', 'hashtag_stat');

tagSchema.methods.check_TagExist = function(cb){
	//var num_row = 
	//console.log(chalk.bgCyan('seaching. '+this.name));
	return this.model('hashtag_stat').find({ name: this.name }, cb);
	//console.log('search '+this.name);
	//console.log('-------------end for---------')
	//return 'hey';
  //return this.model('user_data').find({ username: this.username }, cb);
};

var Tags = mongoose.model('hashtag_stat',tagSchema);
module.exports = Tags;