import axios from "axios"
import { SERVER_URL } from "../../../config/config"

const api = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true, // to allow server to read and write to cookies when using axios
})

export async function register({ username, email, password }: { username: string, email: string, password: string }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })

        return response.data;

    } catch (err) {
        const error = err as Error;
        console.error(error);
    }
}

export async function login({ email, password }: { email: string, password: string }) {
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        })

        return response.data;

    } catch (err) {
        const error = err as Error;
        console.error(error);
    }
}

export async function logout() {
    try {
        const response = await api.get('/api/auth/logout')

        return response.data;

    } catch (err) {
        const error = err as Error;
        console.error(error);
    }
}

export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me')

        return response.data;

    } catch (err) {
        const error = err as Error;
        console.error(error);
    }
}