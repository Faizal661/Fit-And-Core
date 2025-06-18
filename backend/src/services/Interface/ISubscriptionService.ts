import { Types } from "mongoose";
import { ISubscriptionModel } from "../../models/subscription.models";
import {
  ISubscription,
  CheckoutSubscriptionParams,
  SubscriptionStatus,
  VerifiedPaymentResult,
} from "../../types/subscription.types";

export interface ISubscriptionService {
  createCheckoutSession(
    params: CheckoutSubscriptionParams
  ): Promise<{ stripeSessionId: string }>;
  verifyPayment(sessionId: string): Promise<VerifiedPaymentResult>;
  processWebhookEvent(payload: string | Buffer, signature: string): Promise<void>;
  checkSubscription(
    userId: string,
    trainerId: string
  ): Promise<SubscriptionStatus>;

  getUsersWithExpiringSubscriptions(days: number): Promise<ISubscriptionModel[]>;
}
