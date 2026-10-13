const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @route POST /api/auth/register
 * @description Register a new user, expects username, email, password in body
 * @access Public
 */

async function registerUserController(req, res) {
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

    // create token for the created user
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    // set in cookies
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @route POST /api/auth/login
 * @description Login an existing user, expects email and password in body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body

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

    // create token for the created user
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    // set in cookies
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @route GET /api/auth/logout
 * @description Logout user by blacklisting the token and clearing the cookie
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if (token) {
        // add in blacklist
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully."
    })
}

/**
 * @route GET /api/auth/get-me
 * @description Get the current logged in user details
 * @access Private
 */
async function getMeController(req, res) {
    // the middle ware has user - id, username
    const user = await userModel.findById(req.user.id)

    // fetch user data on refresh when logged in
    res.status(200).json({
        message:"User details fetched succesfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }