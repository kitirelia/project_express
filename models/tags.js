var mongoose = require('mongoose');
var chalk = require('chalk');

var Schema = mongoose.Schema;

var tagSchema = new Schema({
	name:String,
	createdAt: {
        type: Date,
        required: false,
        default: Date.now
     },
     founder:{type: Schema.Types.ObjectId, ref: 'user'}
	//create_date:{Date,timestamps: true} 
});
tagSchema.set('collection', 'all_hashtag');

tagSchema.methods.check_TagExist = function(cb){
	//var num_row = 
	//console.log(chalk.bgCyan('seaching. '+this.name));
	return this.model('all_hashtag').find({ name: this.name }, cb);
	//console.log('search '+this.name);
	//console.log('-------------end for---------')
	//return 'hey';
  //return this.model('user_data').find({ username: this.username }, cb);
};

var Tags = mongoose.model('all_hashtag',tagSchema);
module.exports = Tags;