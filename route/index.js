// Basic routes
var flash = require('connect-flash')
  , topNav = require('./topNav')
  , sideNav = require('./sideNav')
  , Contest = require("../models/contest");
 
// Basic user checking and responding otherwise
var login_flash_msg = "You must be logged in to proceed";
var default_imageurl = "https://dl.dropboxusercontent.com/u/69791784/3Dthon/assets/img/user-icon.png";
var default_contest_imageurl = "";

module.exports.render = function(destination, request, response) {
    if (!request.user) {
	request.flash("error", login_flash_msg);
	response.redirect("/signup");
    }
    else {
	var imageurl = request.user.imageurl;
	if (!imageurl) 
	    request.user.imageurl = default_imageurl;
	response.render(destination, {
	    user: request.user, 
	    topNav: topNav.createTopNav(destination),
	    sideNav: sideNav.createSideNav(destination) 
	}); 
    }
}


module.exports.signup = function(request, response) {
    if (request.user) {
	this.render("dashboard", request, response);
    }	
    else {
	response.render("signup", {
	    signup_flash_msg: request.flash("signup_error"), 
	    flash_msg: request.flash("error")
	}); 
    }
};

module.exports.signout = function(request, response) {
    request.logout();
    response.redirect("/");
};


// Post a new contest
module.exports.postContest = function(request, response) {
    if (!request.contest_title || request.contest_title === "")
	response.render("/newContest", {"error": "Title can not be blank"});
    
    var user = request.user;
    
    var imageurl = request.contest_image;
    if (!imageurl || imageurl === "")
	imageurl = default_contest_imageurl;
    
    var new_contest = new Contest({
	    title: request.contest_title,
	    description: request.contest_description.val(),
	    createdBy: user._id,
	    endTime: new Date(3014, 12, 31, 0, 0, 0, 0)
	});
    new_contest.images.push(imageurl);
    console.log(new_contest);
    
    new_contest.save(function(err) {
	    
	});

    user.hosted.push(_id);
    user.save();
}