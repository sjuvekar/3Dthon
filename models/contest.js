var mongoose = require("mongoose");

var ContestSchema = mongoose.Schema({
    title: {
	type: String,
	required: true
    },
    description: {
	type: String,
	required: true
    },
    createdBy: {
	type: mongoose.Schema.Types.ObjectId,
	required: true
    },
    createdAt: {
	type: Date,
	default: Date.now
    },
    endTime: {
	type: Date,
	required: true
    },
    images: {
	type: [String]
    },
    reward: {
	type: [String]
    }
});

module.exports = mongoose.model('Contest', ContestSchema);
