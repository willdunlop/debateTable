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
  red: String,
  blue: String,
  item: [
    {type: Schema.Type.ObjectId, ref: 'Item'}
  ]

});

module.exports = mongoose.model('Debate', Debate);
