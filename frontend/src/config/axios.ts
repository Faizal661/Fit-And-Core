import axios from "axios";
import { store } from "../redux/store";
import { startLoading, stopLoading } from "../redux/slices/loadingSlice";
// import { refreshAccessToken } from "../services/authService";
import { updateToken, clearAuth } from "../redux/slices/authSlice";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  timeout: 10000, 
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
    console.error('INTERCEPTOR REQUEST ERROR:', error);
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('INTERCEPTOR RESPONSE SUCCESS',response)
    store.dispatch(stopLoading());
    return response;
  },
  async (error) => {
    console.log('INTERCEPTOR RESPONSE ERROR :', error);
    store.dispatch(stopLoading());

    if (!error.response) {
      console.log('Network error - server may be down');
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        // const newToken = await refreshAccessToken();
        // store.dispatch(updateToken(newToken));
        // originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Session expired, please login again");
        store.dispatch(clearAuth());
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);


export default api;
