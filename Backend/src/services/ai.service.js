const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score indicating how well the candidate's resume matches the job description, on a scale of 0 to 100."),
    technicalQuestions:
        z.array(z.object({
            question: z.string().describe("The technical question can be ask int the interview"),
            intention: z.string().describe("The intention behind asking the question"),
            answer: z.string().describe("How to answer the question, what points to cover, what approach to take, etc.")
        })).describe("A list of technical questions that can be asked in the interview, along with the intention behind asking each question and how to answer them."),


    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention behind asking the question"),
        answer: z.string().describe("How to answer the question, what points to cover, what approach to take, etc.")
    })).describe("A list of behavioral questions that can be asked in the interview, along with the intention behind asking each question and how to answer them."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking and needs to improve"),
        severity: z.enum(["High", "Medium", "Low"]).describe("The severity of the skill gap")
    })).describe("A list of skill gaps that need to be addressed."),
    
    preparationPlan: z.array(z.object({
    day: z.number().describe("The day number in the preparation plan"),
    focus: z.string().describe("The main focus or topic to cover on that day"),
    tasks: z.array(z.string()).describe("A list of specific tasks or activities to complete on that day to prepare for the interview")
    })).describe("A plan for preparing for the interview.")
})


async function generateInterviewReport ({ resume, selfDescription, jobDescription}){
    const prompt = `Generate an interview report for a candidate based on the following information:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
    `
    try {
        const response = await ai.models.generateContent({  
            model: "gemini-2.0-flash",
            contents: prompt,
            config:{
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(interviewReportSchema)
            }
        })
        console.log(JSON.parse(response.text))
    } catch(err){
        if(err.status === 429){
            console.log("Gemini API quota exceeded. Try again tomorrow or upgrade your plan.")
        } else {
            console.log("AI Service Error:", err.message)
        }
    }
}

module.exports = generateInterviewReport