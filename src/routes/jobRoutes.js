const asyncHandler = require("express-async-handler")
const express = require("express")
const router = express.Router()
const { protectRoutes } = require("../middlewares/authMiddleWare")

const Job = require("../models/Job")
const User = require("../models/user")

router.get('/', protectRoutes, asyncHandler(async (req, res) => {
    const Jobs = await Job.find({
        user: req.user.id
    })

    res.status(200).json(Jobs)
}))

router.post('/', protectRoutes, asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error("Please add a text field")
    }

    const Job = await Job.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(Job)
}))

router.patch('/:id', protectRoutes, asyncHandler(async (req, res) => {
    const Job = await Job.findById(req.params.id)

    if (!Job) {
        res.status(400)
        throw new Error('Job not found')
    }

    if (!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if (Job.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedJob)
}))

router.delete('/:id', protectRoutes, asyncHandler(async (req, res) => {
    const Job = await Job.findById(req.params.id)

    if (!Job) {
        res.status(400)
        throw new Error("Job not found")
    }

    if (!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if (Job.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    res.status(200).json({
        message: `Job with id:${req.params.id} has been successfully deleted`
    })
}))

module.exports = router