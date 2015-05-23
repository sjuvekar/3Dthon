// Define routes for simple SSJS web app. 
// Writes Coinbase orders to database.
var async   = require('async')
  , express = require('express')
  , http    = require('http')
  , https   = require('https')
  , route   = require('./route')
  , facebookAuth = require("./auth/facebook")
  , twitterAuth = require("./auth/twitter")
  , googleAuth = require("./auth/google")
  , localAuth = require("./auth/local")
  , passport = require('passport')
  , flash = require('connect-flash')
  , mongooseDB = require('./models/mongooseDB');


var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8080);

// App configuration
app.use(express.static(__dirname + "/assets"));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://s3-us-west-1.amazonaws.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

http.createServer(app).listen(app.get('port'), function() {
      console.log("Listening on " + app.get('port'));
});

// Initialize mongoose DB
mongooseDB.mongooseInit();

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


// Main page
app.get('/', function(request, response) { route.render("index", request, response); });

// Signup and Signout
app.get('/signup', function(request, response) { route.signup(request, response); });
app.get('/signout', function(request, response) { route.signout(request, response); });

// User dashboard, profile and competitions
app.get("/profile", function(request, response) { route.render("profile", request, response); });
app.get("/competitions", function(request, response) { route.render("competitions", request, response); });
app.get("/rankings", function(request, response) { route.render("competitions", request, response); });
app.get("/forums", function(request, response) { route.render("competitions", request, response); });
app.get("/newContest", function(request, response) { route.render("newContest", request, response); });

// Get a particular competition 
app.get("/competitions/:id?", function(request, response) { route.render("existingContest", request, response); });

// Privacy and Terms, Static pages
app.get('/privacy', function(request, response) { response.render("privacy"); });
app.get('/terms', function(request, response) { response.render("terms"); });


// Facebook login and callbacks
app.get('/auth/facebook', facebookAuth.facebookAuth());
app.get('/auth/facebook/callback', facebookAuth.facebookAuthWithCallback());


// Twitter login and callbacks
app.get('/auth/twitter', twitterAuth.twitterAuth());
app.get('/auth/twitter/callback', twitterAuth.twitterAuthWithCallback());


// Google login and callbacks
app.get('/auth/google', googleAuth.googleAuth());
app.get('/auth/google/callback', googleAuth.googleAuthWithCallback());


// Post method
app.post("/local_signin", localAuth.local_signin());
app.post("/local_signup", function(request, response) { localAuth.local_signup(request, response); });
app.post("/post_contest", function(request, response) { route.postContest(request, response); });
	 
