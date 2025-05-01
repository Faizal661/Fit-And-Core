import api from "../config/axios.config";

import {
  GoogleAuthResponse,
  LoginCredentials,
  LoginResponse,
} from "../types/auth.type";

export const checkEmailUsername = async (data: {
  username: string;
  email: string;
}) => {
  const response = await api.post(`/auth/check-email-username`, data);
  return response.data; // { available: boolean, username: string, email: string ,message:string, password:string}
};

export const isValidEmail = async (data: { email: string }) => {
  const response = await api.post(`/auth/check-email`, data);
  return response.data; // { available: boolean,email: string }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await api.post(`/auth/verify-otp`, data);
  return response.data; // { success: boolean }
};

export const ResendOtp = async (email: string) => {
  await api.post(`/auth/resend-otp`, { email });
};

export const resetPassword = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.put(`/auth/reset-password`, data);
  return response.data;
};

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await api.post(`/auth/register`, data);
  return response.data; // { user: { id, username, email } }
};

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post(`/auth/login`, credentials, {
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
  const response = await api.post(`/auth/google/verify`, { token });
  return response.data;
};

// Logout user
export const logoutUser = async (): Promise<boolean> => {
  try {
    await api.post(`/auth/logout`, {}, { withCredentials: true });
    return true;
  } catch (error) {
    throw error;
  }
};

//trainer application
export const submitTrainerApplication = async (data: FormData) => {
  console.log("request send ", data);
  const response = await api.post("/trainer/apply-trainer", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
