const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
        type: String,
        enum: ['read', 'write', 'delete', 'admin', 'update', 'manage_users', 'manage_roles']
    }],
    description: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

const roleModel = mongoose.model("roles", roleSchema)

module.exports = roleModel