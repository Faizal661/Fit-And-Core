import React, { useState } from "react";
import LoginBody from "../../components/auth/LoginBody";
import userLoginImage from "../../assets/images/image1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import { Facebook } from "lucide-react";
import Google from "../../assets/icons/Google";

import { loginSchema, type LoginFormData } from "../../schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/authService";
import { useDispatch } from "react-redux";
import { setAuth } from "../../redux/slices/authSlice";
import { useToast } from "../../context/ToastContext";

const UserLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const {showToast}=useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(
        setAuth({
          user: data.user,
          accessToken: data.accessToken,
        })
      );
      showToast("success",AUTH_MESSAGES.LOGIN_SUCCESS)
      navigate("/");
    },
    onError: (error: any) => {
      if (error?.response?.data?.error) {
        setServerError(error?.response?.data?.error);        
      } else {
        setServerError(AUTH_MESSAGES.LOGIN_FAILED);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError("");
    loginMutation.mutate(data);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <LoginBody
      imageSrc={userLoginImage}
      welcomeMessage={AUTH_MESSAGES.LOGIN_MESSAGE}
    >
      <form className="w-full max-w-md flex flex-col  " onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className="text-slate-400">
          EMAIL ADDRESS
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          value="faisalt661@gmail.com"
          className={`border-b-1 border-white mt-2 outline-0 text pb-1 ${
            errors.email ? "border-b-red-500" : ""
          }`}
          />
        {errors.email && (
          <p className="text-red-500 text-md mt-1">{errors.email.message}</p>
          )}

        <label htmlFor="password" className="mt-4 text-slate-400">
          PASSWORD
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          value="Qwert@12"
          className={`border-b-1 border-white mt-2 outline-0 pb-1 ${
            errors.password ? "border-b-red-500" : ""
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-md mt-1">{errors.password.message}</p>
        )}

        {serverError && (
          <p className="text-red-500 text-md mt-4">{serverError}</p>
        )}

        <p className="text-light mt-6">
          Forget Password ?{" "}
          <Link to={"/forget-password"} className="underline">
            Click here
          </Link>
        </p>
        <p className="text-light mt-2">
          New Here ?{" "}
          <Link to={"/signup"} className="underline">
            Sign Up
          </Link>
        </p>
        <button
          type="submit"
          className="mt-14 border-1 rounded-4xl py-2 hover:bg-blue-800 disabled:opacity-70"
          disabled={isSubmitting || loginMutation.isPending}
        >
          {isSubmitting || loginMutation.isPending ? "Logging in..." : "Log In"}
        </button>

        <div className="flex mt-6 border-b-1 border-slate-400 "></div>

        <div className="flex mt-6 gap-3">
          <button
            type="button"
            className="flex w-full border-1 rounded-4xl border-slate-400 p-2 px-5 justify-center items-center gap-4"
            onClick={() => handleSocialLogin("Google")}
          >
            <Google />
            Google
          </button>
          <button
            type="button"
            className="flex w-full border-1 rounded-4xl py-2 px-5 border-slate-400 justify-center items-center gap-4"
            onClick={() => handleSocialLogin("Facebook")}
          >
            <Facebook strokeWidth={0.1} fill="white" color="white" />
            Facebook
          </button>
        </div>

      </form>
    </LoginBody>
  );
};

export default UserLogin;
