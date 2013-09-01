// Define routes for simple SSJS web app. 
// Writes Coinbase orders to database.
var async   = require('async')
  , express = require('express')
  , http    = require('http')
  , https   = require('https')
  , db      = require('./models')
  , route   = require('./route')
  , facebookAuth = require("./auth/facebook")
  , twitterAuth = require("./auth/twitter")
  , googleAuth = require("./auth/google")
  , localAuth = require("./auth/local")
  , passport = require('passport')
  , flash = require('connect-flash')
  , User = require('./models/user')
  , mongoose = require('mongoose');


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
});

// Signup and Signout
app.get('/signup', function(request, response) { route.signup(request, response); });
app.get('/signout', function(request, response) { route.signout(request, response); });

// User dashboard, profile and competitions
app.get('/dashboard', function(request, response) { route.render("dashboard", request, response); });
app.get("/profile", function(request, response) { route.render("profile", request, response); });
app.get("/competitions", function(request, response) { route.render("profile", request, response); });

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
