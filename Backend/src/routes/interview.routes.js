const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")


const interviewRouter = express.Router();

interviewRouter.post("/",authMiddleware.authUser,upload.single("resume"), interviewController.generateInterViewReportController)


interviewRouter.get("/report/:interviewId",authMiddleware.authUser, interviewController.getInterViewReportController)


interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportController)


module.exports = interviewRouter