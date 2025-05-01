import { Types } from "mongoose";
import { ISubscriptionModel } from "../../models/subscription.models";
import { ISubscription, CheckoutSubscriptionParams, SubscriptionStatus} from "../../types/subscription.types";

export interface ISubscriptionService {
    createCheckoutSession(params: CheckoutSubscriptionParams): Promise<{stripeSessionId: string }>
    verifyPayment(sessionId: string): Promise<any>;
    processWebhookEvent(payload: any, signature: string): Promise<void>;
    checkSubscription(userId: string, trainerId: string): Promise<SubscriptionStatus>
}