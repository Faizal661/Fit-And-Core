import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    // Add an authorization token to every request

    
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    console.log(' axios success response',response)
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      console.log('401 response',error)
      console.error('Token expired or invalid, redirecting to login');
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
