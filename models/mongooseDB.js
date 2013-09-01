var mongoose = require('mongoose');

var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  "mongodb://heroku_app16939569:" + process.env.MONGODB_PASSWORD + "@ds041218.mongolab.com:41218/heroku_app16939569";

module.exports.mongooseInit = function() {
    mongoose.connect(uristring, function (err, res) {
	if (err) { 
	    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
	    console.log ('Succeeded connection to: ' + uristring);
	}
    });
};

