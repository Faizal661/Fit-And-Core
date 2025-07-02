import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Camera,
  User,
  Mail,
  Calendar,
  // Phone,
  // MapPin,
  // Building,
  // Hash,
  // Lock,
  // ChevronRight
} from "lucide-react";
import {
  fetchUserProfile,
  updateUserProfile,
  updateProfilePicture,
  changePassword,
} from "../../services/user/userProfile";
import {
  UserProfileFormData,
  userProfileSchema,
} from "../../schemas/userSchema";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "../../schemas/authSchema";
import { STATUS } from "../../constants/messages/status.messages";
import { ERR_MESSAGES } from "../../constants/messages/error.messages";
import { AUTH_MESSAGES } from "../../constants/messages/auth.messages";
import { SUCCESS_MESSAGES } from "../../constants/messages/success.messages";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../context/ToastContext";
import { formatDateForInput } from "../../utils/dateFormat";
import axios from "axios";
import Loader from "../../components/shared/Loader";
import Footer from "../../components/shared/Footer";
import { GlowButton } from "../../components/buttons/GlowButton";
import ErrorPage from "../../components/shared/error/ErrorPage";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const UserProfile = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeSection, setActiveSection] = useState<"profile" | "password">(
    "profile"
  );
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  // Mutations setup...
  const profileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      showToast(STATUS.SUCCESS, SUCCESS_MESSAGES.PROFILE_UPDATED);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(STATUS.ERROR, error.response?.data.message);
      } else {
        showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      showToast(STATUS.SUCCESS, SUCCESS_MESSAGES.PASSWORD_CHANGED);
      resetPassword();
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        showToast(STATUS.ERROR, error.response?.data.message);
      } else {
        showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const profilePictureMutation = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      showToast(STATUS.SUCCESS, SUCCESS_MESSAGES.PROFILE_PICTURE_UPDATED);
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          showToast(STATUS.ERROR, ERR_MESSAGES.TIMEOUT_IMAGE_UPLOAD, 7000);
        } else {
          showToast(
            STATUS.ERROR,
            error.response?.data.message || AUTH_MESSAGES.UNEXPECTED_ERROR
          );
        }
      } else {
        showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

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

  const onProfileSubmit = (data: UserProfileFormData) => {
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: ChangePasswordFormData) => {
    passwordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword,
    });
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast(STATUS.ERROR, ERR_MESSAGES.NOT_AN_IMAGE_ERROR);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast(STATUS.ERROR, ERR_MESSAGES.MAX_IMAGE_SIZE_ERROR);
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);
    profilePictureMutation.mutate(formData);
  };

  if (isLoading) return <Loader />;
  if (error) return <ErrorPage />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600/90 to-purple-600/90 overflow-hidden">
        <div
          className="absolute inset-0 bg-black/10 z-0 opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={staggerContainer}
          className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div variants={fadeIn} className="relative mb-8">
            <div
              className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/20 shadow-xl cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {userData?.profilePicture ? (
                <div className="relative w-full h-full">
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="text-white" size={24} />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Camera className="text-white" size={24} />
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
              <div className="mt-2  text-sm  text-green-300 font-semibold animate-pulse ">
                Updating Profile Image ...
              </div>
            )}
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-4xl font-bold text-white mb-4"
          >
            {userData?.username || "User Profile"}
          </motion.h1>
          <motion.div
            variants={fadeIn}
            className="w-20 h-1 bg-white/30 mx-auto mb-6 rounded-full"
          ></motion.div>
          <motion.p variants={fadeIn} className="text-white/80">
            Manage your profile and account settings
          </motion.p>
        </motion.div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16 text-gray-50"
          >
            <path
              d="M0,126L80,109.7C160,93,320,61,480,42C640,23,800,19,960,32.7C1120,47,1280,79,1440,95.7C1600,112,1760,112,1920,102.7C2080,93,2240,75,2400,67.7C2560,61,2720,65,2880,63C3040,61,3200,51,3360,39.7C3520,28,3680,14,3840,7C4000,0,4160,0,4320,7C4480,14,4640,28,4800,42C4960,56,5120,70,5280,65.3C5440,61,5600,37,5760,44.3C5920,51,6080,89,6240,91C6400,93,6560,61,6720,44.3C6880,28,7040,28,7200,37.3C7360,47,7520,65,7680,79.3C7840,93,8000,103,8160,105C8320,107,8480,103,8640,88.7C8800,75,8960,51,9120,49C9280,47,9440,65,9600,79.3C9760,93,9920,103,10080,93.3C10240,84,10400,56,10560,42C10720,28,10880,28,11040,37.3C11200,47,11360,65,11440,74.7L11520,84L11520,140L11440,140C11360,140,11200,140,11040,140C10880,140,10720,140,10560,140C10400,140,10240,140,10080,140C9920,140,9760,140,9600,140C9440,140,9280,140,9120,140C8960,140,8800,140,8640,140C8480,140,8320,140,8160,140C8000,140,7840,140,7680,140C7520,140,7360,140,7200,140C7040,140,6880,140,6720,140C6560,140,6400,140,6240,140C6080,140,5920,140,5760,140C5600,140,5440,140,5280,140C5120,140,4960,140,4800,140C4640,140,4480,140,4320,140C4160,140,4000,140,3840,140C3680,140,3520,140,3360,140C3200,140,3040,140,2880,140C2720,140,2560,140,2400,140C2240,140,2080,140,1920,140C1760,140,1600,140,1440,140C1280,140,1120,140,960,140C800,140,640,140,480,140C320,140,160,140,80,140L0,140Z"
              className="fill-current"
            ></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100">
            <GlowButton
              onClick={() => setActiveSection("profile")}
              className={
                activeSection === "profile"
                  ? "flex-1 py-4 px-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "flex-1 py-4 px-6 text-center text-gray-600 hover:bg-gray-50"
              }
            >
              Profile Details
            </GlowButton>
            <GlowButton
              onClick={() => setActiveSection("password")}
              className={
                activeSection === "password"
                  ? "flex-1 py-4 px-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                  : "flex-1 py-4 px-6 text-center text-gray-600 hover:bg-gray-50"
              }
            >
              Change Password
            </GlowButton>
          </div>

          <div className="p-8">
            {/* Basic Info Section */}
            <motion.div
              variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{userData?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Joined Date</p>
                  <p className="font-medium">
                    {new Date(userData?.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {activeSection === "profile" && (
              <motion.form
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <motion.div
                  variants={fadeIn}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <input
                      type="text"
                      {...registerProfile("gender")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {profileErrors.gender && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileErrors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      {...registerProfile("dateOfBirth")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {profileErrors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileErrors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    {...registerProfile("phone")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  {profileErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileErrors.phone.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    {...registerProfile("address")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  {profileErrors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {profileErrors.address.message}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={fadeIn}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      {...registerProfile("city")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {profileErrors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileErrors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      {...registerProfile("pinCode")}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                    {profileErrors.pinCode && (
                      <p className="text-red-500 text-sm mt-1">
                        {profileErrors.pinCode.message}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={fadeIn} className="pt-6">
                  <GlowButton
                    type="submit"
                    disabled={!isDirty || profileMutation.isPending}
                    className="w-full"
                    primary
                  >
                    {profileMutation.isPending
                      ? "Saving Changes..."
                      : "Save Changes"}
                  </GlowButton>
                </motion.div>
              </motion.form>
            )}

            {activeSection === "password" && (
              <motion.form
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <motion.div variants={fadeIn}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...registerPassword("currentPassword")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...registerPassword("newPassword")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fadeIn}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...registerPassword("confirmNewPassword")}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  {passwordErrors.confirmNewPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordErrors.confirmNewPassword.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={fadeIn} className="pt-6">
                  <GlowButton
                    type="submit"
                    disabled={passwordMutation.isPending}
                    className="w-full"
                    primary
                  >
                    {passwordMutation.isPending
                      ? "Changing Password..."
                      : "Change Password"}
                  </GlowButton>
                </motion.div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
