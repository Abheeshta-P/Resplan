import { toast } from "react-hot-toast";
import axios from "axios";

import { getMe, login, logout, register } from "../services/auth.api";
import { useAuthContext } from "../auth.context";
import { useEffect } from "react";

// on success and on error toast can be added here

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useAuthContext();

    const handleRegister = async ({
        username,
        email,
        password
    }: {
        username: string;
        email: string;
        password: string;
    }) => {
        setLoading(true);

        try {
            const data: AuthResponse = await register({
                username,
                email,
                password
            });

            setUser(data.user);
            toast.success(data.message);

        } catch (error) {
            console.error("Registration failed:", error);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Registration failed");
            } else {
                toast.error("Registration failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async ({
        email,
        password
    }: {
        email: string;
        password: string;
    }) => {
        setLoading(true);

        try {
            const data: AuthResponse = await login({
                email,
                password
            });

            setUser(data.user);
            toast.success(data.message);

        } catch (error) {
            console.error("Login failed:", error);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Login failed");
            } else {
                toast.error("Login failed");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);

        try {
            const data = await logout();

            setUser(null);
            toast.success(data.message);

        } catch (error) {
            console.error("Logout failed:", error);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message || "Logout failed");
            } else {
                toast.error("Logout failed");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data: AuthResponse = await getMe();
                setUser(data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetUser();
    }, []);

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout
    };
};
