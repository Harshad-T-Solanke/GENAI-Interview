
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({

    candidateName: z.string(),

    overallAssessment: z.string(),

    matchScore: z.number(),

    technicalSkills: z.array(z.string()),

    strengths: z.array(z.string()),

    weaknesses: z.array(z.string()),

    extracurricularActivities: z.array(z.string()),

    achievements: z.array(z.string()),

    softSkills: z.array(z.string()),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["High", "Medium", "Low"])
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    )
});

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
Analyze the candidate professionally based on:

1. Resume
2. Self Description
3. Job Description

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

IMPORTANT INSTRUCTIONS:
- Include extracurricular activities
- Include technical skills
- Include achievements
- Include soft skills
- Include strengths and weaknesses
- Include coding activity and learning attitude
- Include overall candidate assessment
- Generate professional interview questions
- Generate preparation roadmap
- Return response in proper JSON format
`;

    try {

        const response = await ai.models.generateContent({

            model: "gemini-3-flash-preview",

            contents: prompt,

            config: {
                responseMimeType: "application/json",
                responseJsonSchema:
                    zodToJsonSchema(interviewReportSchema)
            }
        });

        const result = JSON.parse(response.text);

        console.log(result);

        return result;

    } catch (err) {

        if (err.status === 429) {

            console.log(
                "Gemini API quota exceeded."
            );

        } else {

            console.log(
                "AI Service Error:",
                err.message
            );
        }
    }
}

module.exports = generateInterviewReport;

