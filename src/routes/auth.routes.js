const express = require("express")
const authController = require("../controllers/auth.controller")

const authRouter = express.Router() // or destructure the Router and use it directly

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login an existing user with email and password
 * @access Public
 */
authRouter.post("/login", authController.loginUserController)

module.exports = authRouter;