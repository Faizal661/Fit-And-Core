import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ISubscriptionController } from "../Interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/Interface/ISubscriptionService";
import { sendResponse } from "../../utils/send-response";
import {
  HttpResCode,
  HttpResMsg,
} from "../../constants/http-response.constants";
import CustomError from "../../errors/CustomError";

@injectable()
export class SubscriptionController implements ISubscriptionController {
  constructor(
    @inject("SubscriptionService")
    private subscriptionService: ISubscriptionService
  ) {
    this.subscriptionService = subscriptionService;
  }

  async createCheckoutSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { trainerId, planDuration, amountInPaise, planName, sessions } =
        req.body;
      const userId = req.decoded?.id;

      if (
        !trainerId ||
        !planDuration ||
        !amountInPaise ||
        !planName ||
        !userId
      ) {
        throw new CustomError(HttpResMsg.BAD_REQUEST, HttpResCode.BAD_REQUEST);
      }

      const session = await this.subscriptionService.createCheckoutSession({
        userId,
        trainerId,
        planDuration,
        amountInPaise,
        planName,
        sessions,
      });

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, session);
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { session_id } = req.query;
      if (!session_id) {
        throw new CustomError(
          HttpResMsg.SESSION_ID_REQUIRED,
          HttpResCode.BAD_REQUEST
        );
      }

      const subscriptionData = await this.subscriptionService.verifyPayment(
        session_id as string
      );

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
        subscription: subscriptionData,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleStripeWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sig = req.headers["stripe-signature"] as string;

      if (!sig) {
        throw new CustomError(
          HttpResMsg.STRIPE_SIGNATURE_MISSING,
          HttpResCode.BAD_REQUEST
        );
      }

      await this.subscriptionService.processWebhookEvent(req.body, sig);
      res.status(200).send();
    } catch (error) {
      console.error(HttpResMsg.WEBHOOK_ERROR, error);
      if (error instanceof CustomError) {
        // Still return 200 to Stripe to prevent retries for known errors
        res.status(200).send();
      } else {
        next(error);
      }
    }
  }

  async checkStatus(req: Request, res: Response, next: NextFunction) {
    const userId = req.decoded?.id!;
    const trainerId = req.query.trainerId as string;

    try {
      const result = await this.subscriptionService.checkSubscription(
        userId,
        trainerId
      );
      // result: { isSubscribed: boolean, subscription: SubscriptionDoc | null }

      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, result);
    } catch (err) {
      next(err);
    }
  }

  async refundSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { subscriptionId } = req.params;
      if (!subscriptionId) {
        throw new CustomError(
          "Subscription ID required",
          HttpResCode.BAD_REQUEST
        );
      }
      const updatedSubscription =
        await this.subscriptionService.refundSubscription(subscriptionId);
      sendResponse(
        res,
        HttpResCode.OK,
        HttpResMsg.SUCCESS,
        updatedSubscription
      );
    } catch (error) {
      next(error);
    }
  }

   async getAllUserSubscriptions(
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const userId = req.decoded?.id;
  
        const { page, limit } = req.query;
  
        if (!userId) {
          throw new CustomError(
            HttpResMsg.UNAUTHORIZED,
            HttpResCode.UNAUTHORIZED
          );
        }
  
        const allUserSubscriptions = await this.subscriptionService.getAllUserSubscriptions(
          userId,
          Number(page),
          Number(limit)
        );
        console.log("🚀 ~ SubscriptionController ~ allUserSubscriptions:", allUserSubscriptions)
  
        sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, {
          data: allUserSubscriptions,
        });
      } catch (error) {
        next(error);
      }
    }
  
}
