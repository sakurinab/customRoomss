const mongoose = require('mongoose');

const pvcSchema = new mongoose.Schema({
	userID: {type: String,},
	ownvc: {type: String},
});

const model = mongoose.model("PvcSchema", pvcSchema);

module.exports = model;