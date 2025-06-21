import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { WalletService } from "../../services/Implementation/wallet.service";
import { sendResponse } from "../../utils/send-response";
import { HttpResCode, HttpResMsg } from "../../constants/http-response.constants";

@injectable()
export class WalletController {
  constructor(
    @inject("WalletService") private walletService: WalletService
  ) {}

  async getWalletData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.decoded?.id;
      const { page = 1, limit = 10, type, startDate, endDate } = req.query;
      const walletData = await this.walletService.getWalletData(
        userId!,
        Number(page),
        Number(limit),
        type as "credit" | "debit" | undefined,
        startDate as string | undefined,
        endDate as string | undefined
      );
      sendResponse(res, HttpResCode.OK, HttpResMsg.SUCCESS, { walletData });
    } catch (error) {
      next(error);
    }
  }
}