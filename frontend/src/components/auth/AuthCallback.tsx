// src/components/AuthCallback.tsx
import  { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback, isLoading, isError } = useGoogleAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');


    if (error) {
      navigate('/login');
      return;
    }

    if (token) {
        processedRef.current= true;
      handleGoogleCallback(token);
    } else {
      navigate('/login');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Completing login...</h2>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Login failed</h2>
          <p>There was an error processing your login. Please try again.</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;