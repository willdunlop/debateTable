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
  red: {
    type: String, default: 'For'
  },
  blue: {
    type: String, default: 'Against'
  },
  item: [
    {type: Schema.Types.ObjectId, ref: 'Item'}
  ]

});

module.exports = mongoose.model('Debate', Debate);
