const mongoose = require("mongoose")

const OfferSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    userName: {
        type: mongoose.Schema.Types.String,
        required: true,
        ref: 'User',
    },
    organization: {
        type: mongoose.Schema.Types.String,
        required: false,
        ref: 'User'
    },
    title: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    jobType: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    isRemote: {
        type: mongoose.Schema.Types.Boolean,
        defaultValue: false,
    },
    location: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    description: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    offeredMoney: {
        type: mongoose.Schema.Types.String,
        required: false
    },
    didSeen: {
        type: mongoose.Schema.Types.Boolean,
        defaultValue: false,
    },
    didAccepted: {
        type: mongoose.Schema.Types.Boolean,
        defaultValue: false,
    },
    didRejected: {
        type: mongoose.Schema.Types.Boolean,
        defaultValue: false,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Offer', OfferSchema)