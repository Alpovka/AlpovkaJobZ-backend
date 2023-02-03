const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const express = require("express")
const router = express.Router()
const User = require("../models/user")
const { protectRoutes } = require("../middlewares/authMiddleWare")

router.post("/", asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw new Error("You must fill all the fields")
    }

    // Check if user exists
    const userExist = await User.findOne({
        email
    })

    if (userExist) {
        res.status(400)
        throw new Error('User already exits')
    }

    // hash password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            name: user.name,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid user data")
    }

}))

router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({
        email
    })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            name: user.name,
            token: generateToken(user.id)
        })
    } else {
        res.status(404)
        throw new Error("Invalid credentials")
    }
}))

// FOR USER PASSWORD RESET THIS WILL BE USED LATER 
// router.patch("/resetpass", asyncHandler(async (req, res) => {
//     const { email, password } = req.body

//     const user = await User.findOne({
//         email
//     })

//     if (user) {
//         await User.updateOne({
//             email
//         }, {
//             password
//         })
//         res.status(200).json({
//             message: "Password successfully changed.",
//         })
//     } else {
//         res.status(404)
//         throw new Error('User is not found')
//     }
// }))


router.get("/me", protectRoutes, asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
}))

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "60d",
    })
}


module.exports = router