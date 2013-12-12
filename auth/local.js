var passport = require("passport")
  , authHelper = require("./authHelper")
  , LocalStrategy = require('passport-local').Strategy
  , User = require("../models/user");

// Local login strategy
passport.use(new LocalStrategy({
      usernameField: "signin_email",
      passwordField: "signin_password"
    },
    function(email, password, done) {
	User.findOne({email: email}, function(err, user) {
	    if (err) { return done(err); }
	    // No User
	    if (!user) {
		return done(null, false, {message: "Email id not found. Have you signed up?"});
	    }
	    // Match password
	    user.comparePassword(password, function(err, isMatch) {
		if (!err && !isMatch) {
		    return done(null, false, { message: 'Could not log in, incorrect password.' });
		}
		else {
		    return done(null, user);
		}
	    });
	});
    }
));


// Export signup function
module.exports.local_signup = function(request, response) {
    var body = request.body;
    authHelper.createUser(body.signup_email, 
			body.signup_password1, 
			body.signup_password2, 
			body.signup_name,
			function(err, user) {
			    if (err) 
				response.render("signup", {signup_flash_msg: err.message, flash_msg: request.flash("error")});
			    else {
				request.login(user, function(err) {
				    if (err) 
					response.render("signup", {signup_flash_msg: err.message, flash_msg: request.flash("error")});
				    else
					response.redirect("/competitions")
				});
			    }
			});
};


// Export signin function
module.exports.local_signin = function() {
    return passport.authenticate("local", { successRedirect: "/competitions",
					    failureRedirect: "/signup",
					    badRequestMessage: "Could not log in. Have you signed up?", 
					    failureFlash: true
					  });
};


