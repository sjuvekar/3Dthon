var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  "mongodb://3dthon:" + process.env.MONGODB_PASSWORD + "@ds041218.mongolab.com:41218/heroku_app16939569";

var mongooseUri = uriUtil.formatMongoose(uristring);

module.exports.mongooseInit = function() {
    mongoose.connect(mongooseUri, function (err, res) {
	if (err) { 
	    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
	} else {
	    console.log ('Succeeded connection to: ' + uristring);
	}
    });
};

