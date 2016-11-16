var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var Account = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  // admin: Boolean,
  //
  // acc_created: Date,
  //
  // updated_at: Date

});

//Date Configs
//on every save, add the date
// Account.pre('save', function(next) {
//   //get current date
//   var currentDate = new Date();
//
//   //Update updated_at to current date
//   this.updated_at = currentDate;
//
//   //update created_at if value is null
//   if (!this.acc_created)
//       this.acc_created = currentDate;
//    next();
//  });

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
