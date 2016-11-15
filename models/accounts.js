var mongoose = require('mongoose');
var accountSchema = new mongoose.Schema({
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

  admin: Boolean,

  acc_created: Date,

  updated_at: Date

});

//Date Configs
//on every save, add the date
accountSchema.pre('save', function(next) {
  //get current date
  var currentDate = new Date();

  //Update updated_at to current date
  this.updated_at = currentDate;

  //update created_at if value is null
  if (!this.acc_created)
      this.acc_created = currentDate;
   next();
 });

 var Account = mongoose.model('Account', accountSchema);

 module.exports = Account;
