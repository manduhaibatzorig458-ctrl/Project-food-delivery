import axios from "axios"

export const backend = axios.create({
    baseURL:"http://localhost:1000",
    headers:{ "Content-Type" : "application/json" },
})

backend.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    config.headers.Authorization = token ? `Bearer ${token}` : null;
    return config;
})