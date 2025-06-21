import { inject, injectable } from "tsyringe";
import { Types } from "mongoose";
import { WalletRepository } from "../../repositories/Implementation/wallet.repository";

@injectable()
export class WalletService {
  constructor(
    @inject("WalletRepository") private walletRepository: WalletRepository
  ) {}

  async getWalletData(
    userId: string,
    page: number,
    limit: number,
    type?: "credit" | "debit",
    startDate?: string,
    endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.walletRepository.getWalletData(
      new Types.ObjectId(userId),
      page,
      limit,
      type,
      start,
      end
    );
  }
}