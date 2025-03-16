import { GoogleAuthResponse, LoginCredentials, LoginResponse } from "../types/auth";
import axios from  "./axios"

export const checkEmailUsername = async (data: { username: string; email: string }) => {
  const response = await axios.post(`/auth/check-email-username`, data);
  return response.data; // { available: boolean, username: string, email: string }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await axios.post(`/auth/verify-otp`, data);
  return response.data; // { success: boolean }
};

export const ResendOtp = async (email: string) => {
  await axios.post(`/auth/resend-otp`, { email });
};

export const createUser = async (data: { username: string; email: string; password: string }) => {
  const response = await axios.post(`/auth/register`, data);
  // console.log('new user data => ',response.data)
  return response.data; // { user: { id, username, email } }
};


export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(`/auth/login`, credentials, {
      withCredentials: true,
    });
    return response.data;
};


// New Google authentication methods
export const initiateGoogleLogin = () => {
  window.location.href = `http://localhost:5000/api/auth/google`;
};

export const verifyGoogleToken  = async (token: string): Promise<GoogleAuthResponse> => {
  const response = await axios.post(`/auth/google/verify`, { token });
  return response.data;
};



// Refresh token
export const refreshAccessToken = async (): Promise<string> => {
  try {
    console.log('refresh token USED TO GET NEW ACCESS TOEKN')
    const response = await axios.post(
      `/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response.data.newAccessToken;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<boolean> => {
  try {
    const data =await axios.post(`/auth/logout`, {}, { withCredentials: true });
    console.log('LOGOUT RES------',data)
    return true
  } catch (error) {
    throw error;
  }
};