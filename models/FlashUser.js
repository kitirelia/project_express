
//---------
var mongoose = require('mongoose');
var User = require('./users');

User.dudify = function() {
  this.name = this.name + '-dude'; 
  return this.name;
};

console.log('this is flash model');


//ake this available to our users in our Node applications
//module.exports = FlashUser;