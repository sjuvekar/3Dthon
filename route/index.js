// Basic routes
var flash = require('connect-flash')
  , topNav = require('./topNav')
  , sideNav = require('./sideNav');

// Basic user checking and responding otherwise
var login_flash_msg = "You must be logged in to proceed";
var default_imageurl = "https://dl.dropboxusercontent.com/u/69791784/3Dthon/assets/img/user-icon.png";

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


