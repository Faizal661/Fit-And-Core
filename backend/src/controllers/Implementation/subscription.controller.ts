import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { ISubscriptionController } from "../Interface/ISubscriptionController";
import { ISubscriptionService } from "../../services/Interface/ISubscriptionService";
import { sendResponse } from "../../utils/send-response";
import { HttpResCode, HttpResMsg } from "../../constants/response.constants";
import { CustomError } from "../../errors/CustomError";

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
      const { trainerId, planDuration, amountInPaise, planName } = req.body;
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
          "Session ID is required",
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
          "Missing Stripe signature",
          HttpResCode.BAD_REQUEST
        );
      }
      console.log("🚀 ~ SubscriptionController ~ req:", req.body)

      await this.subscriptionService.processWebhookEvent(req.body, sig);
      res.status(200).send();
    } catch (error) {
      console.error("Webhook error:", error);
      // Still return 200 to Stripe to prevent retries for known errors
      if (error instanceof CustomError) {
        res.status(200).send();
      } else {
        next(error);
      }
    }
  }
}
