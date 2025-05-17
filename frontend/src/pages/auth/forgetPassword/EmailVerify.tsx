import LoginBody from "../../../components/auth/LoginBody";
import userLoginImage from "../../../assets/images/image1.jpg";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_MESSAGES } from "../../../constants/messages/auth.messages";
import { useMutation } from "@tanstack/react-query";
import { isValidEmail } from "../../../services/authService";
import { useToast } from "../../../context/ToastContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailFormData, emailSchema } from "../../../schemas/authSchema";
import axios from "axios";
import Footer from "../../../components/shared/Footer";
import { STATUS } from "../../../constants/messages/status.messages";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const mutation = useMutation({
    mutationFn: isValidEmail,
    onSuccess: (data) => {
      if (data.isValid) {
        navigate("/otp-verify", { state: { email: data.email } });
      } else {
        showToast(STATUS.ERROR, AUTH_MESSAGES.INVALID_EMAIL);
      }
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          showToast(STATUS.ERROR, AUTH_MESSAGES.INVALID_EMAIL);
        } else {
          showToast(
            "error",
            error.response?.data.message || AUTH_MESSAGES.SERVER_ERROR
          );
        }
      }
    },
  });

  const onSubmit = (data: EmailFormData) => {
    mutation.mutate({ email: data.email });
  };

  return (
    <div>
      <LoginBody
        imageSrc={userLoginImage}
        welcomeMessage={AUTH_MESSAGES.RESET_PASSWORD_MESSAGE}
      >
        <form
          className="w-full max-w-md flex flex-col  "
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="email" className="text-slate-400">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className={`border-b-1 border-white mt-2 outline-0 text ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <p className="text-light mt-8">
            Back to Login &nbsp;
            <Link to={"/login"} className="underline">
              Click here!
            </Link>
          </p>
          <button
            type="submit"
            className="mt-14 border-1  py-2 hover:bg-black"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </LoginBody>
      <Footer />
    </div>
  );
};

export default EmailVerify;
