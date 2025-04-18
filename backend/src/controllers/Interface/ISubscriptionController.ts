import { NextFunction, Request, Response } from "express";

export interface ISubscriptionController {
    createCheckoutSession(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyPayment(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleStripeWebhook(req: Request, res: Response, next: NextFunction): Promise<void>;
}