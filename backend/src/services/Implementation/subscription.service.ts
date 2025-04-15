import { Types } from "mongoose";
import { FilterQuery } from "mongoose";
import Stripe from "stripe";
import { inject, injectable } from "tsyringe";
import { ISubscripton, CheckoutSubscriptionParams} from "../../types/subscription.types";
import { ISubscriptonModel } from "../../models/subscription.models";
import { ISubscriptionRepository } from "../../repositories/Interface/ISubscriptionRepository";
import { ISubscriptionService } from "../Interface/ISubscriptionService";
import { IUserRepository } from "../../repositories/Interface/IUserRepository";

import { sendResponse } from "../../utils/send-response";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode, HttpResMsg } from "../../constants/response.constants";
import { ITrainerRepository } from "../../repositories/Interface/ITrainerRepository";
import { env } from "../../config/env.config";

@injectable()
export default class SubscriptionService implements ISubscriptionService {
    private stripe: Stripe;

  constructor(
    @inject("SubscriptionRepository") private subscriptionRepository: ISubscriptionRepository,
    @inject("UserRepository") private userRepository: IUserRepository,
    @inject("TrainerRepository") private trainerRepository: ITrainerRepository

  ) {
    this.subscriptionRepository = subscriptionRepository;
    this.userRepository = userRepository;
    this.trainerRepository = trainerRepository;
    this.stripe = new Stripe( env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-03-31.basil", 
      });
  }

  async createCheckoutSession(params: CheckoutSubscriptionParams): Promise<{stripeSessionId: string }>{
    try {
        const { userId, trainerId, planDuration, amountInPaise, planName } = params;
  
        const pendingSubscription = await this.subscriptionRepository.create({
          userId: new Types.ObjectId(userId),
          trianerId: new Types.ObjectId(trainerId),
          planDuration,
          amount: amountInPaise / 100, 
          status: 'pending',
          startDate: null,
          expiryDate: null,
          paymentId: null,
        });
  
        const session = await this.stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: planName,
                  description: `${planDuration} personal training subscription`,
                },
                unit_amount: amountInPaise,
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${env.CLIENT_ORIGIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.CLIENT_ORIGIN}/trainer/${trainerId}`,
          metadata: {
            userId,
            trainerId,
            subscriptionId: pendingSubscription._id.toString(),
            planDuration
          },
        }); 
  
        return { stripeSessionId: session.id };
      } catch (error) {
        console.error('Error creating checkout session:', error);
        throw new CustomError(
          "Failed to create checkout session",
          HttpResCode.INTERNAL_SERVER_ERROR
        );
      }
    }

 
  async verifyPayment(sessionId: string): Promise<any> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      console.log("🚀 ~ SubscriptionService ~ verifyPayment ~ session:", session)
      
      if (!session) {
        throw new CustomError("Session not found", HttpResCode.NOT_FOUND);
      }
      
      const { subscriptionId } = session.metadata || {};
      
      if (!subscriptionId) {
        throw new CustomError("Invalid session metadata", HttpResCode.BAD_REQUEST);
      }
      
      const subscription = await this.subscriptionRepository.findById(
        new Types.ObjectId(subscriptionId)
      );
      
      if (!subscription) {
        throw new CustomError("Subscription not found", HttpResCode.NOT_FOUND);
      }
      
      const trainer = await this.trainerRepository.findById(subscription.trianerId);
      
      // Return subscription details with trainer info
      return {
        _id: subscription._id,
        planDuration: subscription.planDuration,
        amount: subscription.amount,
        status: subscription.status,
        startDate: subscription.startDate,
        expiryDate: subscription.expiryDate,
        trainerName: trainer?.username 
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new CustomError(
        "Failed to verify payment",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async processWebhookEvent(payload: any, signature: string): Promise<void> {
    console.log("🚀 ~ SubscriptionService ~ processWebhookEvent ~ signature:", signature)
    console.log("🚀 ~ SubscriptionService ~ processWebhookEvent ~ payload:", payload)
    try {
      // Verify the event came from Stripe
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET
      );
      console.log("🚀 ~ SubscriptionService ~ processWebhookEvent ~ event:", event)

      // Handle checkout.session.completed event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleSuccessfulPayment(session);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      throw new CustomError(
        `Webhook Error: ${(error as Error).message}`,
        HttpResCode.BAD_REQUEST
      );
    }
  }

  private async handleSuccessfulPayment(session: Stripe.Checkout.Session): Promise<void> {
    const { subscriptionId, userId, trainerId, planDuration } = session.metadata || {};
    
    if (!subscriptionId || !userId || !trainerId) {
      throw new CustomError("Invalid session metadata", HttpResCode.BAD_REQUEST);
    }
    
    const expiryDate = this.calculateExpiryDate(planDuration);
    
    await this.subscriptionRepository.update(
      new Types.ObjectId(subscriptionId),
      {
        status: 'active',
        paymentId: session.payment_intent as string, 
        startDate: new Date(),
        expiryDate
      }
    );
  }

  private calculateExpiryDate(planDuration?: string): Date {
    const today = new Date();
    
    if (planDuration === "1 Month") {
      return new Date(today.setMonth(today.getMonth() + 1));
    } else if (planDuration === "6 Months") {
      return new Date(today.setMonth(today.getMonth() + 6));
    } else if (planDuration === "12 Months") {
      return new Date(today.setMonth(today.getMonth() + 12));
    }
    
    return new Date(today.setMonth(today.getMonth() + 1));
  }
}
