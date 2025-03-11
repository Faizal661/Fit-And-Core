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
