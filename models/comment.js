var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema ({
  author: [
    {type: Schem.Type.ObjectId, ref: 'Account'}
  ],
  comment: String
});

module.exports = mongoose.model('Comment', Comment);
