const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const authModel = mongoose.model("batch123", authSchema);

module.exports = authModel;