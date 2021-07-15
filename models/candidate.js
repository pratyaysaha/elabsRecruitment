const mongoose = require("mongoose")
const candidateStatus = mongoose.Schema({
	domain: {
		type: String,
	},
	shortlisted: {
		type: Boolean,
		default: false,
	},
	final: {
		type: Boolean,
		default: false,
	},
	rating: {
		type: Number,
		default: 0,
	},
})
const candidate = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	roll: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	year: {
		type: String,
		required: true,
	},
	contact: {
		type: String,
		required: true,
	},
	wapp: {
		type: String,
		required: true,
	},
	domain: {
		type: String,
		required: true,
	},
	good_candidate: {
		type: String,
		required: true,
	},
	join_elabs: {
		type: String,
		required: true,
	},
	resume: {
		type: String,
	},
	github: {
		type: String,
	},
	linkedin: {
		type: String,
	},
	status: {
		type: [candidateStatus],
	},
})
module.exports = mongoose.model("Candidate", candidate)
