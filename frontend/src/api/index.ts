import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface PredictionInput {
    age: number;
    sex: string;
    chestPainType: string;
    restingBP: number;
    cholesterol: number;
    fastingBS: number;
    restECG: string;
    maxHR: number;
    exerciseAngina: string;
    oldpeak: number;
    stSlope: string;
}

export interface PredictionResponse {
    risk: 'low' | 'high';
    probability: number;
    message: string;
    timestamp: string;
    input_data: PredictionInput;
}

export const predict = async (input: PredictionInput): Promise<PredictionResponse> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/predict`, input);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.detail || 'Failed to get prediction');
        }
        throw error;
    }
}; 