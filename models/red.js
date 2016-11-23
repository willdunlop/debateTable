var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Red = new Schema({
  name: {
    type: String,
    required: true
  },
  items: [
    {type: Schema.Types.ObjectId, ref: 'Item'}
  ]

});


module.exports = mongoose.model('Red', Red);
