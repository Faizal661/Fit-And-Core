import axios from "../config/axios.config";
import {
  GoogleAuthResponse,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.type";

export const checkEmailUsername = async (data: {
  username: string;
  email: string;
}) => {
  const response = await axios.post(`/auth/check-email-username`, data);
  return response.data; // { available: boolean, username: string, email: string ,message:string, password:string}
};

export const isValidEmail = async (data: { email: string }) => {
  const response = await axios.post(`/auth/check-email`, data);
  return response.data; // { available: boolean,email: string }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await axios.post(`/auth/verify-otp`, data);
  return response.data; // { success: boolean }
};

export const ResendOtp = async (email: string) => {
  await axios.post(`/auth/resend-otp`, { email });
};

export const resetPassword = async (data: {
  email: string;
  password: string;
}) => {
  const response = await axios.put(`/auth/reset-password`, data);
  return response.data;
};

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`/auth/register`, data);
  return response.data; // { user: { id, username, email } }
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await axios.post(`/auth/login`, credentials, {
    withCredentials: true,
  });
  return response.data;
};

// New Google authentication methods
export const initiateGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

export const verifyGoogleToken = async (
  token: string
): Promise<GoogleAuthResponse> => {
  const response = await axios.post(`/auth/google/verify`, { token });
  return response.data;
};

// Logout user
export const logoutUser = async (): Promise<boolean> => {
  try {
    await axios.post(`/auth/logout`, {}, { withCredentials: true });
    return true;
  } catch (error) {
    throw error;
  }
};

//trainer application
export const submitTrainerApplication = async (data: FormData) => {
  console.log("request send ", data);
  const response = await axios.post("/trainer/apply-trainer", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
