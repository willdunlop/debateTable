var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Item = new Schema({
  title: {
    type: String,
    required: true
  },
  claim : {
    type: String,
    required: true
  },
  source: String,
  redblue: Boolean,
  comment: [
    {type: Schema.Types.ObjectId, ref: 'Comment'}
  ],
  debate: [
    {type: Schema.Types.ObjectId, ref: 'Debate'}
  ],
  user: [
    {type: Schema.Types.ObjectId, ref: 'Account'}
  ]
});

module.exports = mongoose.model('Item', Item);
