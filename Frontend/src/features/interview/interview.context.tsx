import { createContext, useContext, useState, type ReactNode } from "react";

interface InterviewContextType {
    report: InterviewReport | null;
    setReport: React.Dispatch<React.SetStateAction<InterviewReport | null>>;
    reports: InterviewReport[] | null;
    setReports: React.Dispatch<React.SetStateAction<InterviewReport[] | null>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InterviewContext = createContext<InterviewContextType | null>(null);

export const InterviewProvider = ({ children }: { children: ReactNode }) => {
    const [report, setReport] = useState<InterviewReport | null>(null)
    const [reports, setReports] = useState<InterviewReport[] | null>(null)

    const [loading, setLoading] = useState(false);

    return (
        <InterviewContext.Provider value={{ report, setReport, reports, setReports, loading, setLoading }}>
            {children}
        </InterviewContext.Provider>
    )
}

export const useInterviewContext = () => {
    const context = useContext(InterviewContext);

    if (!context) {
        throw new Error("useInterviewContext must be used inside InterviewProvider");
    }

    return context;
}