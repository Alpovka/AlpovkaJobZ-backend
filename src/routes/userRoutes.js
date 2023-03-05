const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")
const express = require("express")
const router = express.Router()
const User = require("../models/user")
const { protectRoutes } = require("../middlewares/authMiddleWare")
const nodemailer = require("nodemailer");
const htmlExporter = require("../../views/confirmView")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS
    }
});

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

        const secret = process.env.JWT_SECRET + user.password;
        try {
            const token = jwt.sign({ email: user.email, id: user._id }, secret, {
                expiresIn: "15m",
            });

            const link = `http://localhost:8000/api/users/confirmation/${user._id}/${token}`;

            var mailOptions = {
                from: 'karavelx@gmail.com',
                to: user.email,
                subject: 'Confirm your Email',
                html: `Please click this link to confirm your email: <a href="${link}">${link}</a>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(500)
                    throw new Error("An Error occured")
                } else {
                    res.status(200).json("OK")
                }
            });
        } catch (error) {
            res.status(500)
            throw new Error("An Error occured")
        }
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

        if (!user.confirmed) {
            res.status(500)
            throw new Error("Please confirm your email to login")
        }

        res.status(200).json({
            name: user.name,
            organization: user?.organization,
            token: generateToken(user.id)
        })

    } else {
        res.status(404)
        throw new Error("Invalid credentials")
    }
}))


router.get("/confirmation/:id/:token", asyncHandler(async (req, res) => {
    const { id, token } = req.params

    const user = await User.findOne({
        _id: id
    })

    try {
        const secret = process.env.JWT_SECRET + user.password;
        jwt.verify(token, secret)
        await User.updateOne({
            _id: id
        }, {
            $set: {
                confirmed: true
            }
        })
        res.send(htmlExporter("Your email has been successfully confirmed!", "http://localhost:3000/JobZ/Login"))
        return
    } catch (error) {
        return res.status(500).send("Could not confirmed, try again later.")
    }

}))

router.post("/forgot-password", asyncHandler(async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({
        email
    })

    if (user) {
        const secret = process.env.JWT_SECRET + user.password;
        try {
            const token = jwt.sign({ email: user.email, id: user._id }, secret, {
                expiresIn: "15m",
            });

            const link = `http://localhost:8000/api/users/reset-password/${user._id}/${token}`;

            var mailOptions = {
                from: 'karavelx@gmail.com',
                to: user.email,
                subject: 'Password reset',
                html: `Please click this link to change your password: <a href="${link}">${link}</a>`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    res.status(500).json("Something went wrong :(")
                } else {
                    res.status(200).json("OK")
                }
            });
        } catch (error) {
            res.status(500).send("An Error occured")
        }
    } else {
        res.status(404)
        throw new Error('User is not found')
    }
}))

router.get("/reset-password/:id/:token", asyncHandler(async (req, res) => {
    const { id, token } = req.params;

    const user = await User.findOne({
        _id: id
    })

    if (user) {
        const secret = process.env.JWT_SECRET + user.password;
        try {
            const goVerify = jwt.verify(token, secret)
            res.render("index", { email: goVerify.email, status: "Not verified" })
        } catch (error) {
            res.send("Not verified")
        }
    } else {
        res.status(404)
        throw new Error('User is not found')
    }
}))

router.post("/reset-password/:id/:token", asyncHandler(async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        _id: id
    })

    if (user) {
        const secret = process.env.JWT_SECRET + user.password;
        try {
            const goVerify = jwt.verify(token, secret)
            const salt = await bcrypt.genSalt()
            const encryptedPassword = await bcrypt.hash(password, salt)
            await User.updateOne({
                _id: id
            }, {
                $set: {
                    password: encryptedPassword
                }
            })
            res.status(200).send(htmlExporter("Your password has been successfully changed!", "http://localhost:3000/JobZ/Login"))
            res.render("index", { email: goVerify.email, status: "Verified" })
        } catch (error) {
            res.status(500).json("An Error occured")
        }
    } else {
        res.status(404)
        throw new Error('User is not found')
    }
}))

router.get("/me", protectRoutes, asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
}))

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "60d",
    })
}


module.exports = router