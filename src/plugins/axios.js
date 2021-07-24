import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://0.0.0.0:5000',
    headers: {
        post: { 'Content-Type': 'application/json' }
    }
});

export default instance;
