var express = require('express');
var fs = require('fs');

// Variable devclaration
var htmlfile = "index.html";
var signupfile = "signup.html";
var dashboardfile = "dashboard.html";

var app = express.createServer(express.logger());

app.use(express.static(__dirname + "/assets"));

// Main page
app.get('/', function(request, response) {
  var html = fs.readFileSync(htmlfile).toString();
  response.send(html);
});

// Signup page
app.get('/signup', function(request, response) {
  var sgnup = fs.readFileSync(signupfile).toString();
  response.send(sgnup);
});

// User dashboard
app.get('/dashboard', function(request, response) {
  var dash = fs.readFileSync(dashboardfile).toString();
  response.send(dash);
});


var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
