var mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('mongo-relation');
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
