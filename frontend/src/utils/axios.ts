import axios from "axios";
import { store } from "../redux/store"; 
import { startLoading,stopLoading } from "../redux/slices/loadingSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    store.dispatch(startLoading())
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    store.dispatch(stopLoading());
    return response;
  },
  (error) => {
    store.dispatch(stopLoading());
    if (error.response?.status === 401) {
      console.error('Unauthrorized Access, Redirecting to Login');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
