var mongoose = require('mongoose');
var chalk = require('chalk');
var Schema = mongoose.Schema;

var personSchema = Schema({
 // _id     : Number,
  name    : String,
  user_name:String,
  age     : Number,
  email	  :String,
  stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
	_creator : { type: Schema.Types.ObjectId, ref: 'Person' },
 // _creator : { type: Number, ref: 'Person' },
  user_name:{ type: String, ref: 'Person' },
  title    : String,
  fans     : [{ type: Number, ref: 'Person' }]
});

personSchema.set('collection', 'Person');
storySchema.set('collection', 'Story');

var Story  = mongoose.model('Story', storySchema);
var Person = mongoose.model('Person', personSchema);

module.exports = {
    Story: Story,
    Person: Person
};