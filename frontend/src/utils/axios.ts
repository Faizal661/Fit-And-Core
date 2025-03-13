import axios from "axios";
import { store } from "../redux/store";
import { startLoading, stopLoading } from "../redux/slices/loadingSlice";
import { refreshAccessToken } from "../services/authService";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    console.log("inside axios interceptor req", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    store.dispatch(startLoading());
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
     console.log('inside axios interceptor response...',response.config)
    store.dispatch(stopLoading());
    return response;
  },
  async (error) => {
    store.dispatch(stopLoading());

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        //setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest); 
      } catch (err) {
        console.error("Session expired, please login again");
        return Promise.reject(err);
      }
    }

    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      console.error("Unauthrorized Access, Redirecting to Login");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
