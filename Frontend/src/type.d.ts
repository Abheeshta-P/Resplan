type AuthResponse = {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

type InterviewRequest = {
    jobDescription: string;
} & (
    | { resume: File; selfDescription?: string }
    | { resume?: File; selfDescription: string }
);

type InterviewQuestion = {
    question: string;
    intention: string;
    answer: string;
};

type SkillGap = {
    skill: string;
    severity: "low" | "medium" | "high";
};

type PreparationDay = {
    day: number;
    focus: string;
    tasks: string[];
};

type InterviewReport = {
    _id: string;
    jobDescription: string;
    resume?: string;
    selfDescription?: string;
    matchScore: number;
    technicalQuestions: InterviewQuestion[];
    behavioralQuestions: InterviewQuestion[];
    skillGaps: SkillGap[];
    preparationPlan: PreparationDay[];
    user: string;
    title: string;
    createdAt?: string;
    updatedAt?: string;
};