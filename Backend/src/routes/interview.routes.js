const express = require("express")
const interviewRouter = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware")

/**
 * @route POST /api/interview
 * @description Generate new interview report on the basis of user self description, resume pdf and job description.
 * @access Protected
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

module.exports = interviewRouter