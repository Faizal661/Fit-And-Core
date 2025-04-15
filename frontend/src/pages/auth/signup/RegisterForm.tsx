import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import LoginBody from "../../../components/auth/LoginBody";
import Google from "../../../assets/icons/Google";
import userSignUpImage from "../../../assets/images/img4.jpg";
import { checkEmailUsername } from "../../../services/authService";
import { AUTH_MESSAGES } from "../../../constants/auth.messages";
import { type SignUpFormData, SignUpSchema } from "../../../schemas/authSchema";
import { useToast } from "../../../context/ToastContext";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import Footer from "../../../components/shared/Footer";
import { STATUS } from "../../../constants/status.messges";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { showToast } = useToast();
  const { handleGoogleLogin } = useGoogleAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const mutation = useMutation({
    mutationFn: checkEmailUsername,
    onSuccess: (data) => {
      if (data.available) {
        localStorage.setItem(
          "registrationData",
          JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          })
        );
        showToast(STATUS.SUCCESS, AUTH_MESSAGES.OTP_SENT);
        navigate("/signup/verify-otp");
      } else {
        setError(data.message);
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
        showToast(STATUS.ERROR, error.response?.data.message);
      } else {
        setError(AUTH_MESSAGES.SERVER_ERROR);
        showToast(STATUS.ERROR, AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const onSubmit = (values: SignUpFormData) => mutation.mutate(values);

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      handleGoogleLogin();
    }
  };

  return (
    <div>
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
            // value="faizall"
            id="name"
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
            // value="mohammedfaizal.t.bca.2@gmail.com"
            type="email"
            id="email"
            className={`border-b-1 border-white my-2 outline-0 text ${
              errors.email ? "border-b-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <label htmlFor="password" className=" text-slate-400">
            PASSWORD
          </label>
          <input
            {...register("password")}
            type="password"
            // value="Qwert@12"
            id="password"
            className={`border-b-1 border-white my-2 outline-0  text ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 ">{errors.password.message}</p>
          )}

          <label htmlFor="confirmPassword" className="text-slate-400">
            CONFIRM PASSWORD
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            // value="Qwert@12"
            id="confirmPassword"
            className={` border-b-1 border-white my-2 outline-0  text  ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 ">{errors.confirmPassword.message}</p>
          )}

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
      <Footer />
    </div>
  );
};

export default RegisterForm;
