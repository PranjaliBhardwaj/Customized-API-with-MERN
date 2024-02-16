const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    status: {type: [String], required: true},
    commodity: {type: String, required: true},
});

module.exports = mongoose.model("data", dataSchema);
