import { login, logout, register } from "../services/auth.api";
import { useAuthContext } from "../auth.context";

// on success and on error toast can be added here

export const useAuth = () => {

    const { user, setUser, loading, setLoading } = useAuthContext();

    const handleRegister = async ({ username, email, password }: { username:string, email: string, password: string }) => {
        setLoading(true);

        const data = await register({ username, email, password });
        setUser(data.user);

        setLoading(false);
    }

    const handleLogin = async ({ email, password }: { email: string, password: string }) => {
        setLoading(true);

        const data = await login({ email, password });
        setUser(data.user);

        setLoading(false);
    }

    const handleLogout = async () => {
        setLoading(true);

        await logout();
        setUser(null);

        setLoading(false);
    }

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        handleLogout
    }
};