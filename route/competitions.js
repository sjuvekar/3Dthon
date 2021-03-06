var Contest = require("../models/contest");

var default_imageurl = "https://dl.dropboxusercontent.com/u/69791784/3Dthon/assets/img/user-icon.png";

module.exports.render = function(request, response) {
    var imageurl = request.user.imageurl;
    if (!imageurl) 
	request.user.imageurl = default_imageurl;

    Contest.find({}, function(err, result) {
	if (!err) {
	    response.render("competitions", {
		user: request.user,
		competitions: result, 
	    });
	}
    });
} 
