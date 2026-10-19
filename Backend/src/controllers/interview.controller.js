const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    let resumeContent;
    if(req.file) {
        const pdfParse = require("pdf-parse");
        const parsedResume = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        resumeContent = parsedResume.text;
    }

    
    const { selfDescription, jobDescription } = req.body;

    if (!req.file && !selfDescription?.trim()) {
        return res.status(400).json({
            message: "Resume or self-description is required."
        });
    }

    const interviewReportByAI = await generateInterviewReport({
        ...(resumeContent && {resume: resumeContent}),
        ...(selfDescription && { selfDescription }),
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        ...(resumeContent && { resume: resumeContent }),
        ...(selfDescription && { selfDescription }),
        jobDescription,
        ...interviewReportByAI
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
}

/**
 * @description Controller to retrieve an interview report by ID for the authenticated user.
 */
async function getInterViewReportByIdController(req, res) {
    const { interviewId } = req.params
    if (!interviewId) {
        return res.status(400).json({
            message: "Bad Request. Interview id is required."
        })
    }

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report retrived successfully.",
        interviewReport
    })
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterViewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    if (!interviewReports) {
        return res.status(404).json({
            message: "Interview reports not found associated with this user."
        })
    }

    res.status(200).json({
        message: "Interview reports retrived successfully.",
        interviewReports
    })
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterViewReportByIdController, getAllInterViewReportsController, generateResumePdfController }