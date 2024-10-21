/**
 * axios with a custom config.
 */

import axios, { AxiosRequestHeaders } from 'axios';

const instance = axios.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
});

instance.interceptors.request.use(
    async (config) => {
        const header = {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        } as AxiosRequestHeaders;

        config.headers = header;

        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // whatever you want to do with the error
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.reload();
        }

        throw error;
    },
);

export default instance;
