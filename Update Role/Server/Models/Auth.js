const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    otp: Number,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'roles',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const authModel = mongoose.model("users",authSchema)

module.exports = authModel