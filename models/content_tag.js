var mongoose = require('mongoose');
var chalk = require('chalk');

var Schema = mongoose.Schema;

var content_tag_schema= new Schema({
	content_id:String,
	tag_name:String
});

content_tag_schema.set('collection','hashtag_content');
var ContentTag = mongoose.model('hashtag_content',content_tag_schema);

module.exports = ContentTag;