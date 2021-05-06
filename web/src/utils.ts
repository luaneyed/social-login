import axios from 'axios';

export const SERVER_URL = 'http://localhost:9000';
export const request = axios.create({ baseURL: SERVER_URL, withCredentials: true });
