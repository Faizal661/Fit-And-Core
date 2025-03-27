import { UserProfileFormData } from "../../schemas/userSchema";
import axios from "../../config/axios.config";
import { ChangePasswordFormData } from "../../schemas/authSchema";

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

export const changePassword = async (passwordData: ChangePasswordFormData) => {
  const response = await axios.put('/user/change-password', passwordData);
  return response.data;
};
