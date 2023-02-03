const mongoose = require("mongoose")

const OfferSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
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
        required: false,
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
        type: mongoose.Schema.Types.Number,
        required: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Offer', OfferSchema)