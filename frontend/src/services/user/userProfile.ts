import api from "../../config/axios.config";
import { UserProfileFormData } from "../../schemas/userSchema";
import { ChangePasswordFormData } from "../../schemas/authSchema";

export const fetchUserProfile = async () => {
  const response = await api.get("/user/profile");
  return response.data;
};

export const updateUserProfile = async (data: UserProfileFormData) => {
  const response = await api.put("/user/profile", data);
  return response.data;
};

export const updateProfilePicture = async (formData: FormData) => {
  const response = await api.put('/user/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const changePassword = async (passwordData: ChangePasswordFormData) => {
  const response = await api.put('/user/change-password', passwordData);
  return response.data;
};
