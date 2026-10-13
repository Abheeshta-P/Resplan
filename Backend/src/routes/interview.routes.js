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

/**
 * @route GET /api/interview/report/:interviewId
 * @description Retrieve an existing interview report by its ID.
 * @access Protected
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterViewReportByIdController);

/**
 * @route GET /api/interview/
 * @description Retrieve all interview reports belonging to the authenticated user.
 * @access Protected
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterViewReportsController)

module.exports = interviewRouter