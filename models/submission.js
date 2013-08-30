var mongoose = require("mongoose");

var SubmissionSchema = mongoose.Schema({
    file: {
	type: String,
	required: true
    },
    submittedBy: {
	type: Schema.type.ObjectId;
	required: true
    },
    submittedAt: {
	type: Date,
	default: Date.now
    },
    contestId: {
	type: Schema.type.ObjectId,
	required: true
    },
    additionalInfo: {
	type: String
    },
    additionalLinks: {
	type: [String]
    }
});
