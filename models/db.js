var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/debateTable');
mongoose.connect(MLAB-DT-URI);
