import axios from "axios";
import { store } from "../redux/store";
import { startLoading, stopLoading } from "../redux/slices/loadingSlice";
import { updateToken, clearAuth } from "../redux/slices/authSlice";
import { AUTH_MESSAGES } from "../constants/auth.messages";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log("INTERCEPTOR REQUEST");
    store.dispatch(startLoading());

    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("INTERCEPTOR REQUEST ERROR:", error);
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("INTERCEPTOR RESPONSE SUCCESS", response);
    store.dispatch(stopLoading());

    const newAccessToken = response.headers["x-access-token"];
    if (newAccessToken) {
      store.dispatch(updateToken(newAccessToken));
    }

    return response;
  },
  (error) => {
    console.log("INTERCEPTOR RESPONSE ERROR :", error);
    store.dispatch(stopLoading());

    if (!error.response) {
      console.log("Network error - server may be down");
      return Promise.reject(error);
    }

    if (
      error.response?.status === 403 &&
      error.response.data?.message ===
        "Your account is blocked. Please contact support."
    ) {
      console.error("Your account is blocked. Please contact support.");
      store.dispatch(clearAuth());
      localStorage.setItem("blocked", "true");
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      console.error(AUTH_MESSAGES.SESSION_EXPIRED);
      localStorage.setItem("sessionExpired", "true");
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
