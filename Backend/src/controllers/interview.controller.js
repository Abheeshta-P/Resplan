require("../utils/pdfPolyfills");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeContent;
        if (req.file) {
            try {
                // Ensure polyfills are ready in case of dynamic execution
                require("../utils/pdfPolyfills");
                const pdfParse = require("pdf-parse");
                const parsedResume = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
                resumeContent = parsedResume.text;
            } catch (pdfErr) {
                console.error("PDF Parsing error:", pdfErr);
                return res.status(400).json({
                    message: "Failed to parse the uploaded resume PDF. Please ensure the file is a valid, readable PDF.",
                    error: pdfErr.message
                });
            }
        }

        const { selfDescription, jobDescription } = req.body;

        if (!req.file && !selfDescription?.trim()) {
            return res.status(400).json({
                message: "Resume or self-description is required."
            });
        }

        const interviewReportByAI = await generateInterviewReport({
            ...(resumeContent && { resume: resumeContent }),
            ...(selfDescription && { selfDescription }),
            jobDescription
        });

        if (interviewReportByAI && interviewReportByAI.success === false) {
            return res.status(429).json({
                message: interviewReportByAI.message || "AI request limit exceeded. Please try again later."
            });
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            ...(resumeContent && { resume: resumeContent }),
            ...(selfDescription && { selfDescription }),
            jobDescription,
            ...interviewReportByAI
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("Error in generateInterViewReportController:", err);
        return res.status(err.status || 500).json({
            message: err.message || "Failed to generate interview report."
        });
    }
}

/**
 * @description Controller to retrieve an interview report by ID for the authenticated user.
 */
async function getInterViewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        if (!interviewId) {
            return res.status(400).json({
                message: "Bad Request. Interview id is required."
            });
        }

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report retrived successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("Error in getInterViewReportByIdController:", err);
        return res.status(err.status || 500).json({
            message: err.message || "Failed to retrieve interview report."
        });
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterViewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        if (!interviewReports) {
            return res.status(404).json({
                message: "Interview reports not found associated with this user."
            });
        }

        return res.status(200).json({
            message: "Interview reports retrived successfully.",
            interviewReports
        });
    } catch (err) {
        console.error("Error in getAllInterViewReportsController:", err);
        return res.status(err.status || 500).json({
            message: err.message || "Failed to retrieve interview reports."
        });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findById(interviewReportId);

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);
    } catch (err) {
        console.error("Error in generateResumePdfController:", err);
        return res.status(err.status || 500).json({
            message: err.message || "Failed to generate resume PDF."
        });
    }
}

module.exports = { generateInterViewReportController, getInterViewReportByIdController, getAllInterViewReportsController, generateResumePdfController };
