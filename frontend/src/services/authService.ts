import axios from  "../utils/axios"

export const checkEmailUsername = async (data: { username: string; email: string }) => {
  const response = await axios.post(`/auth/check-email-username`, data);
  return response.data; // Expected response: { available: boolean, username: string, email: string }
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await axios.post(`/auth/verify-otp`, data);
  return response.data; // Expected response: { success: boolean }
};

export const sendOtp = async (email: string) => {
  await axios.post(`/send-otp`, { email });
};

export const createUser = async (data: { username: string; email: string; password: string }) => {
  const response = await axios.post(`/auth/register`, data);
  // console.log('new user data => ',response.data)
  return response.data; // Expected response: { user: { id, username, email } }
};

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
  };
  token: string;
  refreshToken: string;
}

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`/auth/login`, credentials, {
      withCredentials: true, // Important for cookies if using refresh tokens
    });
    console.log('credentials =>',credentials)
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Refresh token
export const refreshAccessToken = async (): Promise<{ token: string }> => {
  try {
    const response = await axios.post(
      `/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post(`/auth/logout`, {}, { withCredentials: true });
  } catch (error) {
    throw error;
  }
};