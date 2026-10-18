import axios from "axios";
import { SERVER_URL } from "../../../config/config";

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */
export const generateInterviewReport = async ({
  resume,
  jobDescription,
  selfDescription,
}: InterviewRequest) => {
  try {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    if (selfDescription) formData.append("selfDescription", selfDescription);
    if (resume) formData.append("resume", resume);

    const response = await api.post("/api/interview/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * @description Service to get interview report by interviewId.
 */
export const getInterviewReportById = async (interviewId: string) => {
  try {
    const response = await api.get(
      `/api/interview/report/${interviewId}`
    );

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
  try {
    const response = await api.get("/api/interview/");

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({
  interviewReportId,
}: {
  interviewReportId: string;
}) => {
  try {
    const response = await api.post(
      `/api/interview/resume/pdf/${interviewReportId}`,
      null,
      {
        responseType: "blob",
      }
    );

    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};