import { useState, useEffect } from "react";
import LoginBody from "../../../components/auth/LoginBody";
import userLoginImage from "../../../assets/images/image1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_MESSAGES } from "../../../constants/auth.messages";
import Google from "../../../assets/icons/Google";

import { loginSchema, type LoginFormData } from "../../../schemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../../services/authService";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../redux/slices/authSlice";
import { useToast } from "../../../context/ToastContext";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import axios from "axios";
import Footer from "../../../components/shared/Footer";

const UserLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState("");
  const { handleGoogleLogin } = useGoogleAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (localStorage.getItem("sessionExpired")) {
      showToast("warning", AUTH_MESSAGES.SESSION_EXPIRED);
      localStorage.removeItem("sessionExpired");
    } else if (localStorage.getItem("blocked")) {
      showToast("warning", "Your account is blocked. Please contact support.");
      localStorage.removeItem("blocked");
    }
  }, []);

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
      showToast("success", AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate(`/${data.user.role}`);
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message || AUTH_MESSAGES.SERVER_ERROR
        );
      } else {
        setServerError(AUTH_MESSAGES.SERVER_ERROR);
      }
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError("");
    loginMutation.mutate(data);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      handleGoogleLogin();
    }
  };

  return (
    <div>
      <LoginBody
        imageSrc={userLoginImage}
        welcomeMessage={AUTH_MESSAGES.LOGIN_MESSAGE}
      >
        <form
          className="w-full max-w-md flex flex-col  "
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="email" className="text-slate-400">
            EMAIL ADDRESS
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            // value="admin@fitcore.com"
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
            <p className="text-red-500 text-md mt-1">
              {errors.password.message}
            </p>
          )}

          {serverError && (
            <p className="text-red-500 text-md mt-4">{serverError}</p>
          )}

          <p className="text-sm mt-6">
            Forget Password ?{" "}
            <Link to={"/forget-password"} className="underline">
              Click here
            </Link>
          </p>
          <p className="text-sm mt-2">
            New Here ?{" "}
            <Link to={"/signup"} className="underline">
              Sign Up
            </Link>
          </p>
          <button
            className="mt-14 border-1 py-2 hover:bg-indigo-900 disabled:opacity-70 cursor-pointer"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending
              ? "Logging in..."
              : "Log In"}
          </button>

          <div className="flex mt-6 border-b-1 border-slate-400 "></div>

          <div className="flex mt-6 gap-3">
            <button
              type="button"
              className="flex w-full border-1 border-slate-400 p-2 px-5 justify-center items-center gap-4 cursor-pointer"
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

export default UserLogin;
