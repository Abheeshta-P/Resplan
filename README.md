# ResPlan: AI-Powered Job Preparation Assistant

ResPlan is a comprehensive Full-Stack web application designed to help job seekers optimize their resumes, analyze job descriptions, and prepare for interviews using Generative AI.

## Key Features
* **Secure Authentication**: Built with JWT and token blacklisting for robust user management.
* **Resume Analysis**: Upload resumes to get AI-driven insights, skill gap detection, and ATS-optimization advice.
* **Interview Prep**: Generate personalized technical and behavioral interview questions based on your resume and target job description.
* **Dynamic PDF Generation**: Create professional, ATS-friendly resumes on-the-fly using *Puppeteer*.

## Tech Stack
* **Frontend**: *React.js*, *Vite*, *SCSS*
* **Backend**: *Node.js*, *Express.js*
* **Database**: *MongoDB Atlas*
* **AI Integration**: *Gemini API* for intelligent text analysis and content generation.
* **PDF Engine**: *Puppeteer*

## Project Architecture
ResPlan follows a modular architecture consisting of:
1. **UI Layer**: Handles user interaction and navigation.
2. **State Layer**: Manages authentication and data flow using React Context.
3. **Service Layer**: Manages communication between the frontend and backend APIs.
4. **Controller Layer**: Handles business logic and AI processing on the server.

## Getting Started
1. **Clone the repository** and install dependencies for both the `/backend` and `/frontend` folders.
2. **Configure Environment Variables**: Set up your *MongoDB* connection string and *Gemini API* key in a `.env` file.
3. **Run the Project**: Use `npm run dev` in both directories to start the development server.