var mongoose = require('mongoose');
var url = process.env.MLAB_DT_URI;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/debateTable');
// mongoose.connect(url);
