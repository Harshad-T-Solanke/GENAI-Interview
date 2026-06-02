
const pdfParse = require("pdf-parse");

const { generateInterViewReport } = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");



async function generateInterViewReportController(req, res) {

    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        const resumeData = await pdfParse(req.file.buffer);
        const resumeContent = resumeData.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterViewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        });

        const parsedReport =
            typeof interviewReportByAi === "string"
                ? JSON.parse(interviewReportByAi)
                : interviewReportByAi;

                console.log(parsedReport);

        if (!parsedReport.title) {
            parsedReport.title = "Software Developer";
        }
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...parsedReport
        });

        res.status(200).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server Error"
        });
    }
}

async function getInterViewReportController(req, res) {

    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report retrieved successfully",
        interviewReport
    });
}

async function getAllInterviewReportController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).select("-resume -selfDescription -jobDescription -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan").sort({ createdAt: -1 });
    
    res.status(200).json({
        message: "Interview reports retrieved successfully",
        interviewReports
    });
}

module.exports = {
    generateInterViewReportController,
    getInterViewReportController,
    getAllInterviewReportController
};
