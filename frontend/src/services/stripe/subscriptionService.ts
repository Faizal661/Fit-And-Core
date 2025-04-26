import api from "../../config/axios.config";
import { SubscriptionData, SubscriptionStatus } from "../../types/subscription.type";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export const createCheckoutSession = async (subscriptionData: SubscriptionData) => {
    const response = await api.post(
      "/subscription/create-checkout-session",
      subscriptionData
    );
    return response.data;
  };

// Function to redirect to Stripe checkout
export const redirectToCheckout = async (sessionId:string) => {
  try {
    const stripe = await stripePromise;
    const { error } = await stripe!.redirectToCheckout({ sessionId });
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

export const verifyPayment = async (sessionId:string | null) => {
    const response = await api.get(`/subscription/verify-payment?session_id=${sessionId}`);
    return response.data;
};


export const checkSubscriptionStatus = async (trainerId: string): Promise<SubscriptionStatus> => {
  const { data } = await api.get(`/subscription/check?trainerId=${trainerId}`);
  return data;
};