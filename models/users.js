
//---------
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
var userSchema = new Schema({
  name: { type:String,required: [true,'no Name'], trim:true},
  username: { type: String, required: [true,'no username'], trim:true,unique: true },
  password: { type: String, trim:true,required:[true,'no password']},
  email: { 
    type: String, 
    required: [true,'blank email'],
    unique: true,
    trim:true,
    validate:[validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  profile_image:String,
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

userSchema.plugin(uniqueValidator);
userSchema.set('collection', 'user_data');


userSchema.methods.dudify = function() {
  this.name = this.name + '-dude'; 
  return this.name;
};


var User = mongoose.model('user_data', userSchema);


//ake this available to our users in our Node applications
module.exports = User;