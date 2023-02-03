const asyncHandler = require("express-async-handler")
const express = require("express")
const router = express.Router()
const { protectRoutes } = require("../middlewares/authMiddleWare")

const Offer = require("../models/offer")

router.get('/', protectRoutes, asyncHandler(async (req, res) => {
    const offers = await Offer.find({
        user: req.user.id
    })

    res.status(200).json(offers)
}))

router.post('/', protectRoutes, asyncHandler(async (req, res) => {
    requiredCondition = !req.body.title || !req.body.jobType || !req.body.location || !req.body.description
    if (requiredCondition) {
        res.status(400)
        throw new Error("Please fill the required places.")
    }

    const offer = await Offer.create({
        user: req.user.id,
        title: req.body.title,
        jobType: req.body.jobType,
        isRemote: req.body.isRemote,
        location: req.body.location,
        description: req.body.description,
        offeredMoney: req.body?.offeredMoney | null,
    })

    res.status(200).json(offer)
}))

router.patch('/:id', protectRoutes, asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id)

    if (!offer) {
        res.status(400)
        throw new Error('Offer not found')
    }

    if (!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if (offer.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    const updatedoffer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedoffer)
}))

router.delete('/:id', protectRoutes, asyncHandler(async (req, res) => {
    const offer = await Offer.findById(req.params.id)

    if (!offer) {
        res.status(400)
        throw new Error("Offer not found")
    }

    if (!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if (offer.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    await Offer.findByIdAndDelete(req.params.id)

    res.status(200).json({
        message: `Offer with id:${req.params.id} has been successfully deleted`
    })
}))

module.exports = router