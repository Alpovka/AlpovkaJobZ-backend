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
    if (!req.body.text) {
        res.status(400)
        throw new Error("Please add a text field")
    }

    const offer = await Offer.create({
        text: req.body.text,
        user: req.user.id
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
        throw new Error("offer not found")
    }

    if (!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if (offer.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    res.status(200).json({
        message: `Offer with id:${req.params.id} has been successfully deleted`
    })
}))

module.exports = router