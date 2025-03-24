import { UserProfileFormData } from "../../schemas/userSchema";
import axios from "../../config/axios.config";

export const fetchUserProfile = async () => {
  const response = await axios.get("/user/profile");
  return response.data;
};

export const updateUserProfile = async (data: UserProfileFormData) => {
  const response = await axios.put("/user/profile", data);
  return response.data;
};

export const updateProfilePicture = async (formData: FormData) => {
  const response = await axios.put('/user/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};