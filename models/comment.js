var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema ({
  author: [
    {type: Schema.Types.ObjectId, ref: 'Account'}
  ],
  item: [
    {type: Schema.Types.ObjectId, ref: 'Item'}
  ],
  comment: String
});

// Comment.plugin(voting, {ref: 'Account'});

module.exports = mongoose.model('Comment', Comment);
