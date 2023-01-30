const asyncHandler = require("express-async-handler")
const express = require("express")
const router = express.Router()
const { protectRoutes } = require("../middlewares/authMiddleWare")

const Goal = require("../models/goal")
const User = require("../models/user")

router.get('/', protectRoutes, asyncHandler(async (req, res) => {
    const goals = await Goal.find({
        user: req.user.id
    })

    res.status(200).json(goals)
}))

router.post('/', protectRoutes, asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error("Please add a text field")
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(goal)
}))

router.patch('/:id', protectRoutes, asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error("User not found")
    }

    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedGoal)
}))

router.delete('/:id', protectRoutes, asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error("Goal not found")
    }

    if (!user) {
        res.status(401)
        throw new Error("User not found")
    }

    if (goal.user.toString() !== user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    await Goal.findByIdAndDelete(req.params.id)

    res.status(200).json({
        message: `Goal with id:${req.params.id} has been successfully deleted`
    })
}))

module.exports = router