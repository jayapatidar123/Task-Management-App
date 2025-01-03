// frontend/src/api/authApi.js
import axios from 'axios';

export const login = async (credentials) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const signup = async (userData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/signup', userData);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
