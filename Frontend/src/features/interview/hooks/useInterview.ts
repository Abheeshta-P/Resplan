import toast from "react-hot-toast";
import { useInterviewContext } from "../interview.context"
import { generateInterviewReport, generateResumePdf, getAllInterviewReports, getInterviewReportById } from "../services/interview.api";
import axios from "axios";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

export const useInterview = () => {
    const { report, setReport, reports, setReports, loading, setLoading } = useInterviewContext();
    const [resumeLoading, setResumeLoading] = useState(false);

    const { interviewId } = useParams()

    const handleGenerateInterviewReport = async ({
        resume,
        jobDescription,
        selfDescription,
    }: InterviewRequest) => {
        setLoading(true);
        try {
            let request: InterviewRequest;
            if (resume && selfDescription) request = { jobDescription, resume, selfDescription };
            else if (resume) request = { jobDescription, resume };
            else if (selfDescription) request = { jobDescription, selfDescription };
            else throw new Error("Resume or self-description is required");

            const response = await generateInterviewReport(request);
            toast.success(response.message);
            setReport(response.interviewReport);

            return response.interviewReport;
        } catch (error) {
            console.error("Could not generate interview report:", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Could not generate interview report");
            } else {
                toast.error("Could not generate interview report");
            }
            return null;
        } finally {
            setLoading(false);
        }
    }

    const handleGetInterviewReportById = async (interviewId: string) => {
        setLoading(true);

        try {
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
            // toast.success(response.message);
            return response.interviewReport;
        } catch (error) {
            console.error("Could not get interview report:", error);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Could not get interview report");
            } else {
                toast.error("Could not get interview report");
            }

            return null;
        } finally {
            setLoading(false);
        }
    };

    const handleGetInterviewReports = async () => {
        setLoading(true);

        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports || []);

            return response.interviewReports || [];
        } catch (error) {
            console.error("Could not get interview reports:", error);
            setReports([]);

            if (axios.isAxiosError(error) && error.response?.status === 404) {
                // Info toast instead of error toast when user has 0 reports
                toast(error.response?.data?.message || "No previous interview plans found", {
                    icon: "ℹ️"
                });
                return [];
            }

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Could not get interview reports"
                );
            } else {
                toast.error("Could not get interview reports");
            }

            return null;
        } finally {
            setLoading(false);
        }
    };


    const getResumePdf = async (interviewReportId: string) => {
        setResumeLoading(true);

        try {
            const response = await generateResumePdf({ interviewReportId });

            const url = window.URL.createObjectURL(
                new Blob([response], { type: "application/pdf" })
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${interviewReportId}.pdf`);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            toast.success("Resume PDF downloaded successfully");
        } catch (error) {
            console.error("Could not generate resume PDF:", error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message || "Could not generate resume PDF"
                );
            } else {
                toast.error("Could not generate resume PDF");
            }
        } finally {
            setResumeLoading(false);
        }
    };


    useEffect(() => {
        if (interviewId)
            handleGetInterviewReportById(interviewId);
        else
            handleGetInterviewReports()

    }, [interviewId]);

    return {
    report,
    reports,
    loading,
    resumeLoading,
    handleGenerateInterviewReport,
    handleGetInterviewReportById,
    handleGetInterviewReports,
    getResumePdf
};
}
