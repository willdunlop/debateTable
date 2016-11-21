var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Debate = new Schema({
  user: [
    {type: Schema.Types.ObjectId, ref: 'Account'}
  ],
  topic: {
    type: String,
    required: true,
    unique: true
  },
  comparitive: Boolean,
  // red: [
  //   {type: mongoose.Schema.Types.ObjectId, ref: 'Red'}
  // ],
  // blue: [
  //   {type: mongoose.Schema.Types.ObjectId, ref: 'Blue'}
  // ],

});

module.exports = mongoose.model('Debate', Debate);
