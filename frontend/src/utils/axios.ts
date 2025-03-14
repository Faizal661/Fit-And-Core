import axios from "axios";
import { store } from "../redux/store";
import { startLoading, stopLoading } from "../redux/slices/loadingSlice";
import { refreshAccessToken } from "../services/authService";
import { updateToken, clearAuth } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log('INTERCEPTOR REQUEST')
    store.dispatch(startLoading());

    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('INTERCEPTOR RESPONSE SUCCESS')
    store.dispatch(stopLoading());
    return response;
  },
  async (error) => {
    console.log('INTERCEPTOR RESPONSE ERROR')

    store.dispatch(stopLoading());
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        store.dispatch(updateToken(newToken));
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Session expired, please login again");
        store.dispatch(clearAuth());

        if (!window.location.pathname.includes("/login")) {
          console.log('1111')
          window.location.href = "/login";
        }

        return Promise.reject(err);
      }
    }

    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      store.dispatch(clearAuth());
      console.error("Unauthorized Access, Redirecting to Login");
      console.log('22222')

      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);


export default api;
