
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
  password: { type: String, trim:true,required:[true,'no password'], select: false },
  email: { 
    type: String, 
    required: [true,'blank email'],
    unique: true,
    trim:true,
    validate:[validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    select: false //protect when fetch data
  },
  profile_image:String,
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: {
        type: Date,
        required: false,
        default: Date.now
     },
  updated_at: Date
});

userSchema.plugin(uniqueValidator);
userSchema.set('collection', 'user');


userSchema.methods.dudify = function() {
  this.name = this.name + '-dude'; 
  return this.name;
};

userSchema.methods.checkExist = function(cb){
  return this.model('user').find({ username: this.username }, cb);
  //var username = this.username;
  //return 'May '+username;
};

var User = mongoose.model('user', userSchema);


//module.exports.myFunc1 = myFunc1;
//ake this available to our users in our Node applications
module.exports = User;
