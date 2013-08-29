// Define routes for simple SSJS web app. 
// Writes Coinbase orders to database.
var async   = require('async')
  , express = require('express')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models')
  , passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
  , LocalStrategy = require('passport-local').Strategy
  , flash = require('connect-flash')
  , User = require('./models/user')
  , mongoose = require('mongoose');

// Variable devclaration
var htmlfile = "index.html";
var signupfile = "signup.html";
var dashboardfile = "dashboard.html";
var privacyfile = "privacy.html";
var termsfile = "terms.html";

var uristring = 
  process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  "mongodb://heroku_app16939569:" + process.env.MONGODB_PASSWORD + "@ds041218.mongolab.com:41218/heroku_app16939569";

mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connection to: ' + uristring);
  }
});

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);

// Passport js configuration
app.use(express.static(__dirname + "/assets"));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Facebook tokens
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
 
// Twitter tokens
var TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
var TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

// Google Tokens
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


// Helper function to create a new user
passport.createUser = function(emailaddress, password1, password2, username, done) {
    if (password1 !== password2) 
	return done({message: "Passwords must match. Try signing up again!"});
    User.findOne({email: emailaddress}, function(err, result) {
	if (!err && result) {
	    console.log("User " + emailaddress + " already exists");  
	    return done({message: "Email id already exists. Try signing in using the id"});
	}
	else {
	    var new_user = new User({email: emailaddress,
				     password: password1,
				     name: username});
	    new_user.save(function(err) { 
		if(err) {
		    console.log("Error saving user " + emailaddress + "  " + err);
		    return done(err);
		}
		else {
		    console.log("Saved user " + emailaddress + " to database"); 
		    return done(null, new_user);
		}
	    });

	}
    });
};

// Helper function to create Social user
passport.createSocialUser = function(profile, strategy, done) {
    var profile_id = profile.id;
    var profile_password = "*";
    var profile_name = profile.displayName;
    var imageurl = null;
    if (profile.photos && profile.photos[0])
	imageurl = profile.photos[0].value;
    console.log(profile);

    User.findOne({email: profile_id}, function(err, result) {
	if(!err && result) {
	    console.log("User already exists. Returning it from database");
	    return done(null, result);
	}
	else {
	    var new_user = new User({email: profile_id,
				     password: profile_password,
				     name: profile_name,
				     imageurl: imageurl });
	    new_user.save(function(err) {
		if(err) {
		    console.log("Error saving user " + profile_id + " to database");
		    return done(err);
		}
		else {
		    console.log("Saved user " + profile_name + " to database");
		    return done(null, new_user);
		}
	    });
	}
    });
}

// Passport js sessions
passport.serializeUser(function(user, done) {
    done(null, user);
    //done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
    done(null, id);
    //User.findById(id, function(err, user) { 
//	done(err, user);
    //});
});

// Facebook login strategy
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.3dthon.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      return passport.createSocialUser(profile, "facebook", done);
  }
));


// Twitter login Strategy
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
      return passport.createSocialUser(profile, "twitter", done);
  }
));


// Google login strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.3dthon.com/auth/google/callback",
    scope: 'https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  },
  function(accessToken, refreshToken, profile, done) {
      return passport.createSocialUser(profile, "google", done);
  }
));

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

// Facebook login and callbacks
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
    successReturnToOrRedirect: '/dashboard', 
    failureRedirect: '/signup' 
}));


// Twitter login and callbacks
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { 
    successReturnToOrRedirect: '/dashboard', 
    failureRedirect: '/signup' 
}));

// Google login and callbacks
app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback', passport.authenticate('google', { 
    successReturnToOrRedirect: '/dashboard', 
    failureRedirect: '/signup' 
}));

//var app = express.createServer(express.logger());


// Main page
app.get('/', function(request, response) {
  global.db.Order.findAll().success(function(orders) {
    var total_backers = orders.length;
    var backer_percent = total_backers;
    if (backer_percent > 100) backer_percent = 100;
    var total_bitcoins = 0;
    orders.forEach(function(order) {
	total_bitcoins += order.amount;
    }); 
    
    response.render("index", {backers: total_backers, percent: backer_percent, bitcoins: total_bitcoins.toFixed(5)});  
  }).error(function(err) {
      console.log(error);
      response.render("index", {backers: 1, bitcoins: 0.00001});  
  });
  
  //var html = fs.readFileSync(htmlfile).toString();
  //response.send(html);
  
});

// Signup page
app.get('/signup', function(request, response) {
    response.render("signup", {signup_flash_msg: request.flash("signup_error"), flash_msg: request.flash("error")});
});

// Signout page
app.get('/signout', function(request, response) {
  request.logout();
  response.redirect("/");
});

// User dashboard
app.get('/dashboard', function(request, response) {
    if (!request.user) {
	request.flash("error", "You must be logged in to proceed");
	response.redirect("/signup");
    }
    else {
	var imageurl = request.user.imageurl;
	if (!imageurl)
	    imageurl = "https://dl.dropboxusercontent.com/u/69791784/3Dthon/assets/img/user-icon.png";
	response.render("dashboard", {username: request.user.name, imageurl: imageurl});
    }
});

// Privacy policy
app.get('/privacy', function(request, response) {
  response.sendfile(privacyfile);
});

// Terms
app.get('/terms', function(request, response) {
  response.sendfile(termsfile);
});


// Post method
app.post("/local_signin",
	 passport.authenticate("local", { successRedirect: "/dashboard",
					  failureRedirect: "/signup",
					  badRequestMessage: "Could not log in. Have you signed up?", 
					  failureFlash: true
					})
	);


app.post("/local_signup", function(request, response) {
    var body = request.body;
    passport.createUser(body.signup_email, 
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
					response.redirect("/dashboard");
				});
			    }
			});

});
	 
//var port = process.env.PORT || 8080;
//app.listen(port, function() {
//  console.log("Listening on " + port);
//});

// Code from bitstarter-ssjs-db. Adding orders to Database
// Render example.com/orders
app.get('/orders', function(request, response) {
  global.db.Order.findAll().success(function(orders) {
    var orders_json = [];
    orders.forEach(function(order) {
      orders_json.push({id: order.coinbase_id, amount: order.amount, time: order.time});
    });
    // Uses views/orders.ejs
    response.render("orders", {orders: orders_json});
  }).error(function(err) {
    console.log(err);
    response.send("error retrieving orders");
  });
});

// Hit this URL while on example.com/orders to refresh
app.get('/refresh_orders', function(request, response) {
  https.get("https://coinbase.com/api/v1/orders?api_key=" + process.env.COINBASE_API_KEY, function(res) {
    var body = '';
    res.on('data', function(chunk) {body += chunk;});
    res.on('end', function() {
      try {
        var orders_json = JSON.parse(body);
        if (orders_json.error) {
          response.send(orders_json.error);
          return;
        }
        // add each order asynchronously
        async.forEach(orders_json.orders, addOrder, function(err) {
          if (err) {
            console.log(err);
            response.send("error adding orders");
          } else {
            // orders added successfully
            response.redirect("/orders");
          }
        });
      } catch (error) {
        console.log(error);
        response.send("error parsing json");
      }
    });

    res.on('error', function(e) {
      console.log(e);
      response.send("error syncing orders");
    });
  });

});

// sync the database and start the server
db.sequelize.sync().complete(function(err) {
  if (err) {
    throw err;
  } else {
    http.createServer(app).listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
    });
  }
});

// add order to the database if it doesn't already exist
var addOrder = function(order_obj, callback) {
  var order = order_obj.order; // order json from coinbase
  if (order.status != "completed") {
    // only add completed orders
    callback();
  } else {
    var Order = global.db.Order;
    // find if order has already been added to our database
    Order.find({where: {coinbase_id: order.id}}).success(function(order_instance) {
      if (order_instance) {
        // order already exists, do nothing
        callback();
      } else {
        // build instance and save
          var new_order_instance = Order.build({
          coinbase_id: order.id,
          amount: order.total_btc.cents / 100000000, // convert satoshis to BTC
          time: order.created_at
        });
          new_order_instance.save().success(function() {
          callback();
        }).error(function(err) {
          callback(err);
        });
      }
    });
  }
};
