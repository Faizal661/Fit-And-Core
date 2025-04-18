// src/components/AuthCallback.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { AUTH_MESSAGES } from "../../constants/auth.messages";
import { REDIRECT_MESSAGES } from "../../constants/redirect.messges";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback, isLoading, isError } = useGoogleAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (error) {
      navigate("/login");
      return;
    }
    if (token) {
      processedRef.current = true;
      handleGoogleCallback(token);
    } else {
      navigate("/login");
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{AUTH_MESSAGES.LOGIN_PROGRESS}</h2>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#2916BA]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{AUTH_MESSAGES.LOGIN_FAILED}</h2>
          <p>{AUTH_MESSAGES.GOOGLE_AUTH_ERROR}</p>
          <button
            type="button"
            className="mt-4 border-1  border-slate-400 p-2 px-5 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            {REDIRECT_MESSAGES.LOGIN}
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
