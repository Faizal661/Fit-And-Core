import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { AUTH_MESSAGES } from "../../constants/messages/auth.messages";
import ErrorPage from "../shared/error/ErrorPage";
import Loader from "../shared/Loader";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <Loader message={AUTH_MESSAGES.LOGIN_PROGRESS} />;

  if (isError)
    return (
      <ErrorPage
        title={AUTH_MESSAGES.LOGIN_FAILED}
        message={AUTH_MESSAGES.GOOGLE_AUTH_ERROR}
      />
    );

  return null;
};

export default AuthCallback;
