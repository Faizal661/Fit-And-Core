import axios from  "../utils/axios"

export const checkEmailUsername = async (data: { username: string; email: string }) => {
  // console.log(data)
  const response = await axios.post(`/auth/check-email-username`, data);
  // console.log('userEmail check is done',response)
  return response.data; // Expected response: { available: boolean, username: string, email: string }
};

export const sendOtp = async (email: string) => {
  await axios.post(`/send-otp`, { email });
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await axios.post(`/verify-otp`, data);
  return response.data; // Expected response: { success: boolean }
};

export const createUser = async (data: { username: string; email: string; password: string }) => {
  const response = await axios.post(`/register`, data);
  return response.data; // Expected response: { user: { id, username, email, token } }
};
