var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({
	name:String,
	surname:String,
	Age:Number,
	Position:String,
	SquadNumber:Number,
	PreviousClub:Array,
	profile_image:String
});

module.exports= mongoose.model('player',BearSchema);//'player is collection name'