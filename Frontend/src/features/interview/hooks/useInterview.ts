import { useState } from "react";

export const dummyInterviewReport:InterviewReport = {
    _id: "670a1b2c3d4e5f6071829301",
    jobDescription:
        "We are looking for a Full-Stack Developer proficient in React, Node.js, Express, MongoDB, REST APIs, and modern frontend development. The ideal candidate understands authentication, database design, performance optimization, testing, and scalable application architecture.",

    resume: "uploads/resume.pdf",

    selfDescription:
        "Full-Stack Developer experienced in building responsive React applications and REST APIs using Node.js, Express, and MongoDB.",

    matchScore: 78,

    technicalQuestions: [
        {
            question: "What is the difference between controlled and uncontrolled components in React?",
            intention:
                "Evaluate understanding of React form handling, component state, and data flow.",
            answer:
                "Controlled components store form values in React state and update them through event handlers. Uncontrolled components store their values in the DOM and are typically accessed using refs. Controlled components are useful when validation and immediate state synchronization are required."
        },
        {
            question: "How does the Node.js event loop work?",
            intention:
                "Assess knowledge of asynchronous programming and Node.js concurrency.",
            answer:
                "The event loop allows Node.js to handle asynchronous operations without blocking the main JavaScript thread. It processes callbacks through phases such as timers, pending callbacks, poll, check, and close callbacks. I/O operations can proceed asynchronously, allowing the application to handle many concurrent connections."
        },
        {
            question: "What is the difference between SQL and MongoDB?",
            intention:
                "Check database fundamentals and the ability to select an appropriate data model.",
            answer:
                "SQL databases typically organize data into relational tables with predefined schemas and support joins and relational constraints. MongoDB stores documents in BSON format within collections and supports flexible document structures. The choice depends on data relationships, consistency requirements, query patterns, and scalability needs."
        },
        {
            question: "How would you implement authentication in a MERN application?",
            intention:
                "Evaluate practical understanding of authentication, authorization, and application security.",
            answer:
                "I would validate credentials on the backend, hash passwords using a suitable password-hashing algorithm, and establish a secure session or issue appropriately managed tokens. For cookie-based authentication, I would use HttpOnly, Secure, and suitable SameSite cookie settings, protect against CSRF where applicable, validate authorization on protected endpoints, and apply rate limiting to login attempts."
        },
        {
            question: "How can you improve the performance of a React application?",
            intention:
                "Assess knowledge of rendering optimization and frontend performance.",
            answer:
                "I would profile the application first, identify unnecessary renders, and optimize only where measurements justify it. Techniques include component decomposition, memoization with React.memo and useMemo when beneficial, stable callbacks where needed, code splitting, lazy loading, list virtualization, and reducing unnecessary network requests."
        }
    ],

    behavioralQuestions: [
        {
            question: "Tell me about a challenging technical problem you solved.",
            intention:
                "Evaluate problem-solving ability, ownership, and technical communication.",
            answer:
                "I would describe a specific problem using the STAR method: explain the situation and task, outline the actions I personally took to investigate and resolve the issue, and share the measurable result. I would also explain what I learned and how I prevented similar problems from recurring."
        },
        {
            question: "How do you handle disagreements with teammates about a technical decision?",
            intention:
                "Assess collaboration, communication, and decision-making.",
            answer:
                "I first clarify the requirements and constraints, then compare the proposed approaches using evidence such as maintainability, performance, complexity, and delivery time. I encourage discussion, use a small proof of concept when necessary, and support the final team decision even if my original suggestion is not selected."
        },
        {
            question: "Describe a time you had to learn a new technology quickly.",
            intention:
                "Understand adaptability and the ability to learn independently.",
            answer:
                "I would explain the goal, identify the minimum concepts needed, consult official documentation, and build a small working example. I would then apply the technology to the actual task, seek feedback, and document important findings so the team could benefit from the learning."
        }
    ],

    skillGaps: [
        {
            skill: "System Design",
            severity: "high"
        },
        {
            skill: "Automated Testing",
            severity: "medium"
        },
        {
            skill: "Database Optimization",
            severity: "medium"
        },
        {
            skill: "React Fundamentals",
            severity: "low"
        },
        {
            skill: "REST API Development",
            severity: "low"
        }
    ],

    preparationPlan: [
        {
            day: 1,
            focus: "React Fundamentals",
            tasks: [
                "Review component lifecycle and hooks.",
                "Practice controlled forms and form validation.",
                "Understand component composition and state management."
            ]
        },
        {
            day: 2,
            focus: "Node.js and Express",
            tasks: [
                "Review the event loop and asynchronous JavaScript.",
                "Build REST endpoints with validation and error handling.",
                "Practice middleware and centralized error handling."
            ]
        },
        {
            day: 3,
            focus: "MongoDB and Database Design",
            tasks: [
                "Review schema design and embedding versus referencing.",
                "Practice aggregation pipelines and common queries.",
                "Understand indexes and how to analyze slow queries."
            ]
        },
        {
            day: 4,
            focus: "Authentication and Security",
            tasks: [
                "Implement a secure login and logout flow.",
                "Review sessions, JWTs, cookies, and authorization.",
                "Study input validation, CSRF, XSS, and rate limiting."
            ]
        },
        {
            day: 5,
            focus: "Testing and Debugging",
            tasks: [
                "Write unit tests for React components and API handlers.",
                "Practice integration testing with a test database.",
                "Review mocking, edge cases, and error scenarios."
            ]
        },
        {
            day: 6,
            focus: "System Design",
            tasks: [
                "Design a scalable REST API.",
                "Review caching, database indexing, and pagination.",
                "Explain trade-offs between alternative architectures."
            ]
        },
        {
            day: 7,
            focus: "Mock Interview and Revision",
            tasks: [
                "Answer technical questions aloud.",
                "Prepare STAR-based behavioral examples from real experience.",
                "Review weak areas and complete a timed mock interview."
            ]
        }
    ],

    user: "670a1b2c3d4e5f6071829302",

    createdAt: "2026-10-10T10:00:00.000Z",
    updatedAt: "2026-10-10T10:00:00.000Z"
};

export const useInterview = () => {
    const [report, setReport] = useState<InterviewReport | null>(null);
    const [loading, setLoading] = useState(false);

    const getReportById = async (id:string) => {
        setLoading(true);

        try {
            // Mock API: match the requested ID
            if (id === dummyInterviewReport._id) {
                setReport(dummyInterviewReport);
            } else {
                setReport(null);
                console.warn("Interview report not found:", id);
            }
        } finally {
            setLoading(false);
        }
    };

    const getResumePdf = () => {
        console.log("Mock resume download");
    };

    return {
        report,
        getReportById,
        loading,
        getResumePdf,
    };
};