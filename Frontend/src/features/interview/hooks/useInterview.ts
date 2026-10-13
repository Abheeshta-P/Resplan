import toast from "react-hot-toast";
import { useInterviewContext } from "../interview.context"
import { generateInterviewReport, getAllInterviewReports, getInterviewReportById } from "../services/interview.api";
import axios from "axios";

export const useInterview = () => {
    const { report, setReport, reports, setReports, loading, setLoading } = useInterviewContext();

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
            setReport(response.InterviewReport);
        } catch (error) {
            console.error("Could not generate interview report:", error);
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Could not generate interview report");
            } else {
                toast.error("Could not generate interview report");
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGetInterviewReportById = async (interviewId: string) => {
        setLoading(true);

        try {
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
            toast.success(response.message);
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
            setReports(response.interviewReports);
            toast.success(response.message);

            return response.interviewReports;
        } catch (error) {
            console.error("Could not get interview reports:", error);

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

    return {
        report,
        reports,
        loading,
        handleGenerateInterviewReport,
        handleGetInterviewReportById,
        handleGetInterviewReports
    }
}