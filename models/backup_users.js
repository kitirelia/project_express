
//---------
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date
});

userSchema.set('collection', 'user_data');

userSchema.methods.dudify = function() {
  this.name = this.name + '-dude'; 
  return this.name;
};

// userSchema.pre('save',function (next){
// 	console.log('saving..');
// 	var currentDate = new Date();
// 	this.updated_at=currentDate;

// 	if(!this.created_at){
// 		this.created_at = currentDate;
// 	}
// 	next();
// });


// userSchema.pre('save',function (next){
// 	console.log('saving..');
// 	var currentDate = new Date();
// 	this.updated_at=currentDate;

// 	if(!this.created_at){
// 		this.created_at = currentDate;
// 	}
// 	next();
// });
// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('user_data', userSchema);
/*userSchema.pre('save', function (next) {
    var self = this;
    User.find({name : self.name}, function (err, docs) {
        if (!docs.length){
            next();
        }else{                
            console.log('user exists: ',self.name);
            next(new Error("User exists!"));
        }
    });
}) ;*/
userSchema.pre("save",true, function (next,done) {
	var self = this;
	console.log("get username "+self.username);
	User.find({username:self.username},'username', function (err,user){
		if(err){
			console.log('call done(err)');
			done(err);
		}else if(user){
			console.log("user exist");
			self.invalidate('username','username must be uqnique');
			console.log('before  done!');
			done();
			//done(new  Error('username must be unique!'));
		}else{
			console.log('call done()');
			done();
		}
	});
	console.log('call next()');
	next();
});

// make this available to our users in our Node applications
module.exports = User;