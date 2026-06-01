
const pdfParse = require("pdf-parse");

const generateInterViewReport = require("../services/ai.service");

const interviewReportModel = require("../models/interviewReport.model");

async function generateInterViewReportController(req, res) {

    try {

        const resumeData = await pdfParse(req.file.buffer);
        const resumeContent = resumeData.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterViewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        });

        const parsedReport =
            typeof interviewReportByAi === "string"
                ? JSON.parse(interviewReportByAi)
                : interviewReportByAi;

        const interviewReport = await interviewReportModel.create({

            user: req.user.id,

            resume: resumeContent.text,

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

module.exports = {
    generateInterViewReportController
};
