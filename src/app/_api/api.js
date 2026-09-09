import axios from "axios"

export const backend = axios.create({
    baseURL:"http://localhost:1000",
    headers:{ "Content-Type" : "application/json" },
})

