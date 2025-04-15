import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { verifyPayment } from '../../services/stripe/subscriptionPlan';



const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');
  
  useEffect(() => {
    if (!sessionId) {
      navigate('/');
    }
  }, []);
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['paymentVerification', sessionId],
    queryFn: () => verifyPayment(sessionId),
    enabled: !!sessionId,
    retry: 1,
  });
  
  const subscription = data?.subscription;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <div className="w-12 h-12 border-4 border-t-black border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 shadow-sm text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-medium mb-4">Verification Failed</h1>
          <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white  shadow-md overflow-hidden">
        <div className="bg-green-50 p-6 flex justify-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center mb-1">₹ {subscription.amount}</h1>
          <h1 className="text-xl font-medium text-center mb-6">Payment Successful</h1>
          
          {subscription && (
            <div className="space-y-4 mb-8">
              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 mb-1">Plan Duration</h2>
                <p className="font-medium">{subscription.planDuration}</p>
              </div>
              
              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 mb-1">Trainer</h2>
                <p className="font-medium">{subscription.trainerName}</p>
              </div>
              
              <div className="border-b pb-4">
                <h2 className="text-sm text-gray-500 mb-1">Valid Until</h2>
                <p className="font-medium">{new Date(subscription.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 px-4 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Go to Home
            </button>
            
            <button 
              onClick={() => navigate('/find-trainers')}
              className="w-full py-3 px-4 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              Find More Trainers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;