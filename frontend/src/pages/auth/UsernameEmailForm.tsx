import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Facebook } from "lucide-react";

import LoginBody from "../../components/auth/LoginBody";
import Google from "../../assets/icons/Google";
import userSignUpImage from "../../assets/images/img4.jpg";
import { checkEmailUsername } from "../../services/authService";
import { useSignupContext } from "../../context/SignupContext";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import { userNameEmailSchema } from "../../schemas/authSchema";



interface UsernameEmailFormProps {
  onSuccess: (data: { email: string; username: string }) => void;
}

const UsernameEmailForm: React.FC<UsernameEmailFormProps> = ({ onSuccess }) => {
  const { setUserData } = useSignupContext();
  const [error, setError] = useState("");

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
        onSuccess(data);
      } else {
        setError("Username or email already exists");
      }
    },
    onError: () => {
      setError("Server error, please try again");
    },
  });

  const onSubmit = (values: any) => mutation.mutate(values);

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
          className=" border-b-1 border-white mt-2 outline-0 text"
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
          className=" border-b-1 border-white mt-2 outline-0 text"
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
          {/* <Link to={"/otp-verify"}>Sign Up</Link> */}
          Sign Up
        </button>
        <div className="flex mt-6 border-b-1 border-slate-400 "></div>
        <div className="flex mt-6 gap-3">
          <button className="cursor-pointer flex w-full border-1 rounded-4xl border-slate-400 p-2 px-5 justify-center items-center gap-4">
            <Google />
            Google
          </button>
          <button className="cursor-pointer flex w-full border-1 rounded-4xl py-2 px-5 border-slate-400 justify-center items-center gap-4">
            <Facebook strokeWidth={0.1} fill="white" color="white" />
            Facebook
          </button>
        </div>
      </form>
    </LoginBody>
  );
};

export default UsernameEmailForm;
