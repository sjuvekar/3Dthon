// Basic routes
var flash = require('connect-flash')
  , topNav = require('./topNav')
  , sideNav = require('./sideNav')
  , Contest = require("../models/contest")
  , User = require("../models/user")
  , Contest = require("../models/contest");
 
// Basic user checking and responding otherwise
var login_flash_msg = "You must be logged in to proceed";
var default_imageurl = "https://dl.dropboxusercontent.com/u/69791784/3Dthon/assets/img/user-icon.png";
var default_contest_imageurl = "https://dl.dropboxusercontent.com/u/69791784/3Dthon/assets/img/host-contest.png";

module.exports.render = function(destination, request, response) {
    if (!request.user) {
	request.flash("error", login_flash_msg);
	response.redirect("/signup");
    }
    else {
	var imageurl = request.user.imageurl;
	if (!imageurl) 
	    request.user.imageurl = default_imageurl;
	if (["settings", "profile", "competitions", "existingContest"].indexOf(destination) != -1) {
	    if (destination === "competitions") {
		Contest.find({}, function(err, result) {
		    if (!err) {
			response.render(destination, {
			    user: request.user,
			    competitions: result,
			    topNav: topNav.createTopNav(destination),
			    sideNav: sideNav.createSideNav(destination) 
			}); 
		    }
		});
	    }
	    else if (destination === "existingContest") {
		Contest.findById(request.params.id, function(err, result) {
		    console.log(result);
		    if (!err) {
			response.render(destination, {
			    user: request.user,
			    competitions: result,
			    topNav: topNav.createTopNav(destination),
			    sideNav: sideNav.createSideNav(destination) 
			});
		    }
		});
	    }
	    else {
		Contest.find({"createdBy": request.user._id}, function(err, result) { 
		    if(!err) {
			response.render(destination, {
			    user: request.user,
			    competitions: result,
			    topNav: topNav.createTopNav(destination),
			    sideNav: sideNav.createSideNav(destination) 
			}); 
		    }
		});
	    }
	}
	else {
	    response.render(destination, {
		user: request.user,
		topNav: topNav.createTopNav(destination),
		sideNav: sideNav.createSideNav(destination) 
	    }); 
	}
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
	response.redirect("/newContest");
    
    var imageurl = request.body.contest_image;
    if (!imageurl || imageurl === "")
	imageurl = default_contest_imageurl;

    var reward = request.body.contest_reward;
    if (!reward || reward == "0" || reward == "") 
	reward = "Kudos";
    else
	reward = "$" + reward;

    var new_contest = new Contest({
	    title: request.body.contest_title,
	    description: request.body.contest_description,
	    createdBy: request.user._id,
	    endTime: new Date(3014, 12, 31, 0, 0, 0, 0),
	    reward: reward
	});
    new_contest.images.push(imageurl);
    
    new_contest.save(function(err) {
	if (!err) {
	    User.findOne({email: request.user.email}, function(err, oldUser) { 
		oldUser.hosted.push(new_contest._id);
		oldUser.badges.push("Hosted");
		oldUser.save(function(err) {
		    if (!err) {
			response.redirect("/competitions");
		    }
		    else {
			request.contest_flash_error = "Could not create contest, something bad happened. Please try again!";
			response.redirect("/newContest");
		    }
		});
	    });
	    
	}
	else {
	    request.contest_flash_error = "Could not create contest, something bad happened. Please try again!";
	    response.redirect("/newContest");
	}
    });

	
}
