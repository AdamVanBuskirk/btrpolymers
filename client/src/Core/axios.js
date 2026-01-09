import axios from 'axios';
import { store } from '../Core/store';
//import { logout, setAccessToken } from '../Store/Auth';

export const axiosPublic = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
});

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const responseInterceptPublic = axiosPublic.interceptors.response.use(
    response => response,
    async (error) => {
        return Promise.reject({
            "message": error.response.data.message
        });
    }
);

export const requestIntercept = axiosPrivate.interceptors.request.use(
    config => {
        if (!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${store.getState().user.accessToken}`;
        }
        return config;
    }, (error) => Promise.reject(error)
);

export const responseIntercept = axiosPrivate.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
            prevRequest.sent = true;
            const newAccessToken = await axiosPublic.get('/api/auth/refresh', { 
                withCredentials: true 
            }).then((res) => {
                //store.dispatch(setAccessToken(res.data.accessToken));
                return res.data.accessToken;
            }).catch((error) => {
                /* refresh failed w/ 403, log user out */
                //store.dispatch(logout());
            });
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
        } 
        return Promise.reject({
            "message": error.response.data.message
        });
    }
);