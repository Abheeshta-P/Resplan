const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
});

const jsonSchema = z.toJSONSchema(interviewReportSchema);

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    try {
        const prompt = `
Generate an interview preparation report for the candidate.

Resume:
${resume}

Self-description:
${selfDescription}

Job description:
${jobDescription}

Return ONLY a valid JSON object matching the requested schema.
Do not include candidateName, strengths, recommendation,
interviewSummary, or hiringManagerNotes.

Requirements:
- matchScore must be between 0 and 100.
- Generate 5 technical questions with intentions and suggested answers.
- Generate 5 behavioral questions with intentions and suggested answers.
- Identify skill gaps with low, medium, or high severity.
- Create a practical 7-day preparation plan.
- Every plan entry must include day, focus, and tasks.
- title must contain the job title.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: jsonSchema
            }
        });

        if (!response.text) {
            throw new Error("Gemini returned an empty response");
        }

        const parsedResponse = JSON.parse(response.text);

        // Validate the generated report against the Zod schema
        const report = interviewReportSchema.parse(parsedResponse);

        console.log(JSON.stringify(report, null, 2));

        return report;

    } catch (error) {
        if (error.status === 429) {
            console.error("Gemini API quota exceeded.");

            return {
                success: false,
                message: "AI request quota exceeded. Please try again later."
            };
        }

        if (error instanceof SyntaxError) {
            console.error("Gemini returned invalid JSON:", error.message);
        } else if (error instanceof z.ZodError) {
            console.error("Report validation failed:", error.issues);
        } else {
            console.error("Interview report generation failed:", error.message);
        }

        throw error;
    }
}

module.exports = { generateInterviewReport }