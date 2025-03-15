import { LoginCredentials, LoginResponse } from "../types/auth/login";
import axios from  "../utils/axios"

export const checkEmailUsername = async (data: { username: string; email: string }) => {
  const response = await axios.post(`/auth/check-email-username`, data);
  return response.data; // { available: boolean, username: string, email: string }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await axios.post(`/auth/verify-otp`, data);
  return response.data; // { success: boolean }
};

export const sendOtp = async (email: string) => {
  await axios.post(`/send-otp`, { email });
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