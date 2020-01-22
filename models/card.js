var mongoose = require("mongoose");

var cardSchema = new mongoose.Schema({
	question: String, 
	category: String
});

module.exports = mongoose.model("Card", cardSchema);