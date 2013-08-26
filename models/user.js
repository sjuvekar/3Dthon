var mongoose = require("mongoose");

var UserSchema = mongoose.schema({
    email: {
	type: String,
	required: true,
	index: { unique: true }
    },
    password: {
	type: String,
	required: true
    },
    name: {
	type: String,
	required: true
    }
});

module.exports = mongoose.model(User&, UserSchema);
    
