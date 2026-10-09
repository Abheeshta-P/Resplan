require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const generateInterviewReport = require("./src/services/ai.service")

connectToDB()
generateInterviewReport({
  resume: `
    Name: Abheeshta P
    Education: B.E. Computer Science
    Experience: Fresher
    Skills: Java, JavaScript, React, TypeScript, Spring Boot, MongoDB, SQL
    Projects:
    - Task Management Application using React and Node.js
    - Student Management System using Spring Boot and MongoDB
  `,

  selfDescription: `
    I am a computer science graduate interested in full-stack development.
    I enjoy solving problems, learning new technologies, and building
    user-friendly applications. My strengths include problem-solving,
    communication, and adaptability. I sometimes spend extra time
    perfecting details.
  `,

  jobDescription: `
    Job Title: Junior Full Stack Developer

    Required Skills:
    - JavaScript and TypeScript
    - React.js
    - Node.js and Express.js
    - REST API development
    - MongoDB and SQL
    - Git and GitHub

    Responsibilities:
    - Develop and maintain web applications.
    - Build reusable frontend components.
    - Design and integrate REST APIs.
    - Work with databases.
    - Debug issues and collaborate with the development team.

    Experience: Entry-level / Fresher
  `
});

// run server
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})