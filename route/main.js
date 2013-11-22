var User = require("../models/user")
  , Contest = require("../models/contest");

module.exports.render = function(request, response) {
	User.count(function(uError, nUsers) {
			Contest.count(function(cError, nCompetitions) {
				response.render("index", {
					users: nUsers,
					competitions: nCompetitions
			  });
			});
	 });
}