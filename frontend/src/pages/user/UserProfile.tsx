import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserProfileFormData,
  userProfileSchema,
} from "../../schemas/userSchema";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../services/user/userProfile";
import { useToast } from "../../context/ToastContext";
import { formatDateForInput } from "../../utils/dateFormat";



const UserProfile = () => {
  const queryClient = useQueryClient();
  const {showToast}=useToast()

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
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

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      showToast("success","Profile updated successfully!");
    },
  });

  React.useEffect(() => {
    if (userData) {
      console.log('userData--- - - ',userData)
      reset({
        gender: userData.gender,
        dateOfBirth: formatDateForInput(userData.dateOfBirth),
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        pinCode: userData.pinCode,
      });
    }
  }, [userData, reset]);

  const onSubmit = (data: UserProfileFormData) => {
    mutation.mutate(data);
  };

  if (isLoading)
    return (
      <div className="h-screen bg-blue-800 flex justify-center items-center text-4xl font-bold">
        <div className="text-center ">
          <span className="ml-2">Loading profile...</span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="h-screen bg-blue-800 flex justify-center items-center text-4xl font-bold">
        <div className="text-center text-red-500">
          <span className="ml-2">Error loading profile</span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-blue-800 flex flex-col items-center p-4 pt-8">
      <h1 className="text-white text-4xl font-mono mb-2 capitalize">
        {userData?.username || "User Profile"}
      </h1>
      <p className="text-gray-300 font-mono mb-6 text-lg">
        PERSONAL INFORMATION
      </p>

      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-2 border-white">
          {userData?.profilePicture ? (
            <img
              src={userData.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
              <span>Photo</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-md bg-blue-800 text-white">
        {/* Display only information */}
        <div className="mb-6 border-b border-blue-700 pb-4">
          <div className="mb-4">
            <p className="text-xs text-blue-300 mb-1">USERNAME</p>
            <p className="text-white">{userData?.username}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs text-blue-300 mb-1">EMAIL</p>
            <p className="text-white">{userData?.email}</p>
          </div>
          <div className="mb-4">
            <p className="text-xs text-blue-300 mb-1">JOINED DATE</p>
            <p className="text-white">
              {new Date(userData?.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Editable form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-md  mb-1">UPDATE DETAILS</p>
          <div></div>
          <div>
            <label className="text-xs text-blue-300">GENDER</label>
            <input
              type="text"
              {...register("gender")}
              className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
            />
            {errors.gender && (
              <p className="text-red-400 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-blue-300">DATE OF BIRTH</label>
            <input
              type="date"
              {...register("dateOfBirth")}
              className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
            />
            {errors.dateOfBirth && (
              <p className="text-red-400 text-xs mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-blue-300">PHONE</label>
            <input
              type="tel"
              {...register("phone")}
              className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="pt-4">
            <h2 className="text-white mb-4">ADDRESS</h2>

            <div className="mb-4">
              <label className="text-xs text-blue-300">ADDRESS</label>
              <input
                type="text"
                {...register("address")}
                className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
              />
              {errors.address && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-blue-300">PIN CODE</label>
                <input
                  type="text"
                  {...register("pinCode")}
                  className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
                />
                {errors.pinCode && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.pinCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs text-blue-300">CITY</label>
                <input
                  type="text"
                  {...register("city")}
                  className="w-full bg-transparent border-b border-blue-700 text-white pb-1 focus:outline-none"
                />
                {errors.city && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={!isDirty || mutation.isPending}
              className={`w-full py-3 rounded-full ${
                isDirty ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-900"
              } text-white transition-colors text-center`}
            >
              {mutation.isPending ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
