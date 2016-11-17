 var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Debate = new Schema({
  user: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Account'}
  ],
  topic: {
    type: String,
    required: true,
    unique: true
  },
  comparitive: Boolean,
  red: String,
  blue: String


});

module.exports = mongoose.model('Debate', Debate);
