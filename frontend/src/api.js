import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000"
})

export const predict = async (data) => {
    const response = await api.post("/predict", data);
    return response.data;
}
