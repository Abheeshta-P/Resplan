const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const tokenBlacklistModel = require("../models/blacklist.model")

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
}

/**
 * @route POST /api/auth/register
 * @description Register a new user, expects username, email, password in body
 * @access Public
 */

async function registerUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide username, email and password."
            })
        }

        // if username/email already exists return
        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username."
            })
        }

        // hash the password before storing
        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured in environment variables.")
        }

        // create token for the created user
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        // set in cookies
        res.cookie("token", token, COOKIE_OPTIONS)

        res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Register Error:", error)
        res.status(500).json({
            message: "Registration failed due to a server error.",
            error: error.message
        })
    }
}

/**
 * @route POST /api/auth/login
 * @description Login an existing user, expects email and password in body
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            })
        }

        // check whether account exists
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email. User with this email does not exists."
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password."
            })
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not configured in environment variables.")
        }

        // create token for the created user
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        // set in cookies
        res.cookie("token", token, COOKIE_OPTIONS)

        res.status(200).json({
            message: "User logged in successfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("Login Error:", error)
        res.status(500).json({
            message: "Login failed due to a server error.",
            error: error.message
        })
    }
}

/**
 * @route GET /api/auth/logout
 * @description Logout user by blacklisting the token and clearing the cookie
 * @access Public
 */
async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            // add in blacklist
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token", COOKIE_OPTIONS)

        res.status(200).json({
            message: "User logged out successfully."
        })
    } catch (error) {
        console.error("Logout Error:", error)
        res.status(500).json({
            message: "Logout failed due to a server error.",
            error: error.message
        })
    }
}

/**
 * @route GET /api/auth/get-me
 * @description Get the current logged in user details
 * @access Private
 */
async function getMeController(req, res) {
    try {
        // the middle ware has user - id, username
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            })
        }

        // fetch user data on refresh when logged in
        res.status(200).json({
            message: "User details fetched succesfully.",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("GetMe Error:", error)
        res.status(500).json({
            message: "Fetching user failed due to a server error.",
            error: error.message
        })
    }
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }