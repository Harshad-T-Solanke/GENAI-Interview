const mongoose = require('mongoose');


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required "]
    },
    answer: {
        type: String,
        required: [true, "Answer is required "]
    }

}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Behavioral question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required "]
    },
    answer: {
        type: String,
        required: [true, "Answer is required "]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "skill is required"]
    },
    severity: {
        type: String,
        enum: ["High", "Medium", "Low"],
        required: [true, "Severity is required"]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
})

const interviewReportSchema = new mongoose.Schema({

    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String
    },
    candidate_analysis:
    {
        type: String
    },
    overall_assessment:
    {
        type: String
    },
    technical_skills: [
        {
            type: String
        }
    ],
    extracurricular_activities:
        [
            {
                type: String
            }
        ],
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    achievements: [
        {
            type: String
        }
    ],
    soft_skills:
        [
            {
                type: String
            }
        ],
    strengths:
        [
            {
                type: String
            }
        ],

    weaknesses: [
        {
            type: String
        }
    ],

    coding_activity_and_learning_attitude: {
        type: String
    },

    overall_candidate_assessment: {
        type: String
    },

    professional_interview_questions: [
        {
            type: String
        }
    ],

    preparation_roadmap: [
        {
            type: String
        }
    ],


    technicalQuestion: [technicalQuestionSchema],
    behavioralQuestion: [behavioralQuestionSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel;

