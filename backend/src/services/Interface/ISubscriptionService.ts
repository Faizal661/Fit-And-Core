import { Types } from "mongoose";
import { ISubscriptonModel } from "../../models/subscription.models";
import { ISubscripton, CheckoutSubscriptionParams} from "../../types/subscription.types";

export interface ISubscriptionService {
    createCheckoutSession(params: CheckoutSubscriptionParams): Promise<{stripeSessionId: string }>
    verifyPayment(sessionId: string): Promise<any>;
    processWebhookEvent(payload: any, signature: string): Promise<void>;
}