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
  upvote: Number,
  red_blue: Boolean,
  comment: [
    {type: Schema.Types.ObjectId, ref: 'Comment'}
  ],
  user: [
    {type: Schema.Types.ObjectId, ref: 'Account'}
  ]
});

module.exports = mongoose.model('Item', Item);
