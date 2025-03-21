import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

import LoginBody from "../../../components/auth/LoginBody";
import Google from "../../../assets/icons/Google";
import userSignUpImage from "../../../assets/images/img4.jpg";
import { checkEmailUsername } from "../../../services/authService";
import { AUTH_MESSAGES } from "../../../constants/auth.messages";
import {
  type UsernameEmailFormData,
  userNameEmailSchema,
} from "../../../schemas/authSchema";
import { useSignupContext } from "../../../context/SignupContext";
import { useToast } from "../../../context/ToastContext";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";

interface UsernameEmailFormProps {
  onSuccess: (data: UsernameEmailFormData) => void;
}

const UsernameEmailForm: React.FC<UsernameEmailFormProps> = ({ onSuccess }) => {
  const { setUserData } = useSignupContext();
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { handleGoogleLogin } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userNameEmailSchema),
  });

  const mutation = useMutation({
    mutationFn: checkEmailUsername,
    onSuccess: (data) => {
      if (data.available) {
        setUserData({ username: data.username, email: data.email });
        showToast("success", AUTH_MESSAGES.OTP_SENT);
        onSuccess(data);
      } else {
        setError(data.message);
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || AUTH_MESSAGES.SERVER_ERROR);
        showToast(
          "error",
          error.response?.data.message || AUTH_MESSAGES.SERVER_ERROR
        )
      } else {
        setError(AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const onSubmit = (values: UsernameEmailFormData) => mutation.mutate(values);

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      handleGoogleLogin();
    }
  };

  return (
    <LoginBody
      imageSrc={userSignUpImage}
      welcomeMessage={AUTH_MESSAGES.SIGNUP_MESSAGE}
    >
      <form
        className="w-full max-w-md flex flex-col  "
        onSubmit={handleSubmit(onSubmit)}
      >
        <label htmlFor="name" className="text-slate-400 mt-3">
          USER NAME
        </label>
        <input
          {...register("username")}
          type="text"
          id="name"
          // value="faizal"
          className={`border-b-1 border-white mt-2 outline-0 text ${
            errors.username ? "border-b-red-500" : ""
          }`}
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}
        <label htmlFor="email" className="text-slate-400 mt-4">
          EMAIL ADDRESS
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          // value="mohammedfaizal.t.bca.2@gmail.com"
          className={`border-b-1 border-white my-2 outline-0 text ${
            errors.email ? "border-b-red-500" : ""
          }`}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <p className="text-light mt-10">
          Already have an account?{" "}
          <Link to={"/login"} className="underline">
            Log in
          </Link>
        </p>
        <button className="btn-primary mt-10 border-1 rounded-4xl py-2 cursor-pointer">
          Sign Up
        </button>
        <div className="flex mt-6 border-b-1 border-slate-400 "></div>
        <div className="flex mt-6 gap-3">
          <button
            type="button"
            className="flex w-full border-1 rounded-4xl border-slate-400 p-2 px-5 justify-center items-center gap-4 cursor-pointer"
            onClick={() => handleSocialLogin("Google")}
          >
            <Google />
            Google
          </button>
        </div>
      </form>
    </LoginBody>
  );
};

export default UsernameEmailForm;
