import axios from 'axios';

const api = axios.create({
    baseURL: 'https://diabetes-fastapi.onrender.com/predict'
});

export default api;