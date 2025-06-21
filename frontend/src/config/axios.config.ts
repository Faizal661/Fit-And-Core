import axios from "axios";
import { store } from "../redux/store";
import { startLoading, stopLoading } from "../redux/slices/loadingSlice";
import { updateToken, clearAuth } from "../redux/slices/authSlice";
import { AUTH_MESSAGES } from "../constants/messages/auth.messages";
import { ERR_MESSAGES } from "../constants/messages/error.messages";
import { SUCCESS_MESSAGES } from "../constants/messages/success.messages";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  timeout: 20000,
});

api.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading());
    console.log(SUCCESS_MESSAGES.INTERCEPTOR_REQUEST_SUCCESS);

    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    console.error(ERR_MESSAGES.INTERCEPTOR_REQUEST_ERROR, error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading());
    console.log(SUCCESS_MESSAGES.INTERCEPTOR_RESPONSE_SUCCESS, response);

    const newAccessToken = response.headers["x-access-token"];
    if (newAccessToken) {
      store.dispatch(updateToken(newAccessToken));
    }

    return response;
  },
  (error) => {
    store.dispatch(stopLoading());
    console.log(ERR_MESSAGES.INTERCEPTOR_RESPONSE_ERROR, error);

    if (!error.response) {
      console.log(ERR_MESSAGES.NETWORK_ERROR);
      return Promise.reject(error);
    }

    if (
      error.response?.status === 403 &&
      error.response.data?.message === AUTH_MESSAGES.ACCOUNT_BLOCKED
    ) {
      store.dispatch(clearAuth());
      console.error(AUTH_MESSAGES.ACCOUNT_BLOCKED);
      localStorage.setItem("blocked", "true");
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      console.error(AUTH_MESSAGES.SESSION_EXPIRED);
      // localStorage.setItem("sessionExpired", "true");
      store.dispatch(clearAuth());
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
