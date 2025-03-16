// src/hooks/useGoogleAuth.ts
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { initiateGoogleLogin, verifyGoogleToken } from '../services/authService';
import { setAuth } from '../redux/slices/authSlice';
import { AUTH_MESSAGES } from '../constants/auth.messages';
import { useToast } from '../context/ToastContext';

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {showToast}=useToast()

  // Mutation for verifying Google token
  const verifyTokenMutation = useMutation({
    mutationFn: verifyGoogleToken,
    onSuccess: (data) => {
      dispatch(
        setAuth({
          user: data.user,
          accessToken: data.accessToken,
        })
      );
      showToast("success", AUTH_MESSAGES.LOGIN_SUCCESS);
      navigate("/");
    },
    onError: () => {
      showToast("error", AUTH_MESSAGES.GOOGLE_AUTH_FAIL);
      navigate("/login");
    },
  });

  // Function to initiate Google login
  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  // Function to handle Google callback
  const handleGoogleCallback = (token: string) => {
    verifyTokenMutation.mutate(token);
  };

  return {
    handleGoogleLogin,
    handleGoogleCallback,
    isLoading: verifyTokenMutation.isPending,
    isError: verifyTokenMutation.isError,
    error: verifyTokenMutation.error,
  };
};