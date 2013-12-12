var passport = require("passport")
  , authHelper = require("./authHelper")
  , FacebookStrategy = require('passport-facebook').Strategy;

// Facebook tokens
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// Facebook login strategy
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    profileFields: ['id', 'displayName', 'photos'],
    callbackURL: "http://www.3dthon.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      return authHelper.createSocialUser(profile, "facebook", done);
  }
));


module.exports.facebookAuth = function() { return passport.authenticate("facebook"); };
module.exports.facebookAuthWithCallback = function() { 
    return passport.authenticate("facebook", { 
	successReturnToOrRedirect: '/competitions',
	failureRedirect: '/signup' 
    });
};  
    
