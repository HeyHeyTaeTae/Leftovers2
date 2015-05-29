// models/index.js

var mongoose = require("mongoose");

// mongoose.connect( process.env.MONGOLAB_URI ||
//                 process.env.MONGOHQ_URL ||
// 				"mongodb://localhost/leftovers");

mongoose.connect("mongodb://localhost/leftovers");

module.exports = require("./user");