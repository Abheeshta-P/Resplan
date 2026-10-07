import type { ReactNode } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";
import { Navigate } from "react-router";

const Protected = ({children}:{children:ReactNode}) => { 
    const {user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen/>;
    }

    if(!user){
        return <Navigate to={"/login"}/>;
    }

    return children;
}
export default Protected;