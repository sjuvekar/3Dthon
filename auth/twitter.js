var passport = require("passport")
  , authHelper = require("./authHelper")
  , TwitterStrategy = require('passport-twitter').Strategy;


// Twitter tokens
var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

// Twitter login Strategy
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
      return authHelper.createSocialUser(profile, "twitter", done);
  }
));

module.exports.twitterAuth = function() { return passport.authenticate("twitter"); };
module.exports.twitterAuthWithCallback = function() { 
    return passport.authenticate("twitter", { 
	successReturnToOrRedirect: "/dashboard", 
	failureRedirect: "/signup" 
    });
};  
