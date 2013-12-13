var Contest = require("../models/contest");

var default_imageurl = "https://dl.dropboxusercontent.com/u/69791784/3Dthon/assets/img/user-icon.png";

module.exports.render = function(request, response) {
    var imageurl = request.user.imageurl;
    if (!imageurl) 
	request.user.imageurl = default_imageurl;
    
    Contest.findById(request.params.id, function(err, result) {
	if (!err) {
	    response.render("existingContest", {
		user: request.user,
		competition: result, 
	    });
	}
    });
} 
