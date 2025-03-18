import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../../services/authService";
import { type PasswordFormData, passwordSchema } from "../../../schemas/authSchema";
import { useToast } from "../../../context/ToastContext";
import { AUTH_MESSAGES } from "../../../constants/auth.messages";
import LoginBody from "../../../components/auth/LoginBody";
import setPasswordImage from "../../../assets/images/calisthenics1.jpg";

const NewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state as { email: string };
  const { showToast } = useToast();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      navigate("/login");
      showToast("success", AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
    },
    onError: () => {
      showToast("error", AUTH_MESSAGES.SERVER_ERROR);
      setServerError(AUTH_MESSAGES.SERVER_ERROR)
    },
  });

  const onSubmit = (values: PasswordFormData) => {
    mutation.mutate({ email, password: values.password });
  };

  return (
    <LoginBody imageSrc={setPasswordImage} welcomeMessage={AUTH_MESSAGES.SET_PASSWORD}>
      <div className="w-full max-w-md flex flex-col">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label htmlFor="password" className="block mt-2 text-slate-400">
              NEW PASSWORD
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className={`w-full border-b-1 mt-3 outline-0 pb-2 ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mt-6 text-slate-400">
              CONFIRM PASSWORD
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className={`w-full border-b-1 mt-3 outline-0 pb-2 ${errors.confirmPassword ? "border-red-500" : ""}`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}
          <button
            type="submit"
            disabled={isSubmitting || mutation.isPending}
            className="mt-10 w-full border-1 rounded-4xl py-2 hover:bg-blue-900 hover:cursor-pointer transition-colors disabled:opacity-70"
          >
            {isSubmitting || mutation.isPending ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </LoginBody>
  );
};

export default NewPassword;