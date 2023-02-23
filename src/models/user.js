const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.String,
        required: false,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    confirmed: {
        type: mongoose.Schema.Types.Boolean,
        defaultValue: false,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("User", userSchema)