var mongoose = require('mongoose');
var chalk = require('chalk');

var Schema = mongoose.Schema;

var content_tag_schema= new Schema({
	content_id:{type: Schema.Types.ObjectId, ref: 'content_data'},
	tag_id:{type: Schema.Types.ObjectId, ref: 'all_hashtag'},
	tag_name:{type: String, ref: 'all_hashtag'}
});

content_tag_schema.set('collection','hashtag_content');
var ContentTag = mongoose.model('hashtag_content',content_tag_schema);

module.exports = ContentTag;