import { useForm } from "react-hook-form";
import React, { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserProfileFormData,
  userProfileSchema,
} from "../../schemas/userSchema";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "../../schemas/authSchema";
import { changePassword } from "../../services/user/userProfile";
import {
  fetchUserProfile,
  updateUserProfile,
  updateProfilePicture,
} from "../../services/user/userProfile";
import { useToast } from "../../context/ToastContext";
import { formatDateForInput } from "../../utils/dateFormat";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import axios from "axios";
import Footer from "../../components/shared/Footer";

const UserProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<"profile" | "password">(
    "profile"
  );

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isDirty },
    reset: resetProfile,
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      gender: userData?.gender || "",
      dateOfBirth: userData?.dateOfBirth || "",
      phone: userData?.phone || "",
      address: userData?.address || "",
      city: userData?.city || "",
      pinCode: userData?.pinCode || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      showToast("success", "Profile updated successfully!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast("error", error.response?.data.message);
      } else {
        showToast("error", AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      showToast("success", "Password changed successfully!");
      resetPassword();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast("error", error.response?.data.message);
      } else {
        showToast("error", AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const profilePictureMutation = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      showToast("success", "Profile picture updated successfully!");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast("error", error.response?.data.message);
      } else {
        showToast("error", AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  // Effect to reset form when user data loads
  React.useEffect(() => {
    if (userData) {
      resetProfile({
        gender: userData.gender,
        dateOfBirth: formatDateForInput(userData.dateOfBirth),
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        pinCode: userData.pinCode,
      });
    }
  }, [userData, resetProfile]);

  // Profile Submit Handler
  const onProfileSubmit = (data: UserProfileFormData) => {
    profileMutation.mutate(data);
  };

  // Password Submit Handler
  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    passwordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  };

  // Profile Picture Change Handler
  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("error", "Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    profilePictureMutation.mutate(formData);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // Loading and Error States
  if (isLoading)
    return (
      <div className="h-screen bg-slate-700 flex justify-center items-center text-4xl font-bold">
        <div className="text-center ">
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen bg-slate-700 flex justify-center items-center text-4xl font-bold">
        <div className="text-center text-red-500">
          <span className="ml-2">Error loading profile</span>
        </div>
      </div>
    );

  return (
    <div>
      <div className="min-h-screen bg-slate-700 flex flex-col items-center p-4 py-8">
        <h1 className="text-white text-4xl mb-2 capitalize  mb-6">
          {userData?.username || "User Profile"}
        </h1>

        {/* Profile Picture Section */}
        <div className="relative mb-6">
          <div
            className="w-32 h-32  overflow-hidden bg-gray-200 cursor-pointer group"
            onClick={handleProfilePictureClick}
          >
            {userData?.profilePicture ? (
              <div className="relative w-full h-full">
                <img
                  src={userData?.profilePicture}
                  alt="profile photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 group-hover:bg-black flex items-center justify-center transition-all duration-300">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Change Photo
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 group-hover:bg-gray-400 transition-all duration-300">
                <span>Upload Photo</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />

          {profilePictureMutation.isPending && (
            <div className="mt-2 text-white text-sm">Uploading...</div>
          )}
        </div>

        <div className="w-full max-w-md  text-white">
          {/* Navigation between Profile and Password Sections */}
          <div className="flex mb-6">
            <button
              onClick={() => setActiveSection("profile")}
              className={`w-1/2 py-2 ${
                activeSection === "profile"
                  ? "border-b-2 border-white"
                  : "text-slate-300"
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveSection("password")}
              className={`w-1/2 py-2 ${
                activeSection === "password"
                  ? "border-b-2 border-white"
                  : "text-slate-300"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* User Information Section */}
          <div className="mb-6 border-b border-slate-400 pb-4">
            <div className="mb-4">
              <p className="text-xs  mb-1">USERNAME</p>
              <p className="text-white">{userData?.username}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs  mb-1">EMAIL</p>
              <p className="text-white">{userData?.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs  mb-1">JOINED DATE</p>
              <p className="text-white">
                {new Date(userData?.joinedDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* PROFILE SECTION */}
          {activeSection === "profile" && (
            <form
              onSubmit={handleProfileSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <p className="text-md mb-1">UPDATE DETAILS</p>
              <div></div>
              <div>
                <label className="text-xs ">GENDER</label>
                <input
                  type="text"
                  {...registerProfile("gender")}
                  className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                />
                {profileErrors.gender && (
                  <p className="text-red-400 text-xs mt-1">
                    {profileErrors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs ">DATE OF BIRTH</label>
                <input
                  type="date"
                  {...registerProfile("dateOfBirth")}
                  className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                />
                {profileErrors.dateOfBirth && (
                  <p className="text-red-400 text-xs mt-1">
                    {profileErrors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs ">PHONE</label>
                <input
                  type="tel"
                  {...registerProfile("phone")}
                  className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                />
                {profileErrors.phone && (
                  <p className="text-red-400 text-xs mt-1">
                    {profileErrors.phone.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <h2 className="text-white mb-4">ADDRESS</h2>

                <div className="mb-4">
                  <label className="text-xs ">ADDRESS</label>
                  <input
                    type="text"
                    {...registerProfile("address")}
                    className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                  />
                  {profileErrors.address && (
                    <p className="text-red-400 text-xs mt-1">
                      {profileErrors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs ">PIN CODE</label>
                    <input
                      type="text"
                      {...registerProfile("pinCode")}
                      className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                    />
                    {profileErrors.pinCode && (
                      <p className="text-red-400 text-xs mt-1">
                        {profileErrors.pinCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs ">CITY</label>
                    <input
                      type="text"
                      {...registerProfile("city")}
                      className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                    />
                    {profileErrors.city && (
                      <p className="text-red-400 text-xs mt-1">
                        {profileErrors.city.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={!isDirty || profileMutation.isPending}
                  className={`w-full py-3 border-1 ${
                    profileMutation.isPending
                      ? "hover:cursor-progress"
                      : isDirty
                      ? "hover:cursor-pointer"
                      : "bg-black opacity-40 hover:cursor-not-allowed"
                  } text-white transition-colors text-center`}
                >
                  {profileMutation.isPending
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* CHANGE PASSWORD */}
          {activeSection === "password" && (
            <form
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <p className="text-md mb-1">CHANGE PASSWORD</p>
              <div>
                <label className="text-xs ">CURRENT PASSWORD</label>
                <input
                  type="password"
                  {...registerPassword("currentPassword")}
                  className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs ">NEW PASSWORD</label>
                <input
                  type="password"
                  {...registerPassword("newPassword")}
                  className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs ">CONFIRM NEW PASSWORD</label>
                <input
                  type="password"
                  {...registerPassword("confirmNewPassword")}
                  className="w-full bg-transparent border-b  text-white pb-1 focus:outline-none"
                />
                {passwordErrors.confirmNewPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {passwordErrors.confirmNewPassword.message}
                  </p>
                )}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={passwordMutation.isPending}
                  className={`w-full py-3 border-1 ${passwordMutation.isPending ? "hover:cursor-progress" : "hover:cursor-pointer" } text-white transition-colors text-center`}
                >
                  {passwordMutation.isPending
                    ? "Changing Password..."
                    : "Change Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
