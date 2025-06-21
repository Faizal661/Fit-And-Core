import { injectable } from "tsyringe";
import { Types } from "mongoose";
import {
  WalletModel,
  TransactionModel,
  IWallet,
  ITransaction,
} from "../../models/wallet.models";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";
import { BaseRepository } from "./base.repository";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> {
  constructor() {
    super(WalletModel);
  }

  async getWalletData(
    userId: Types.ObjectId,
    page: number,
    limit: number,
    type?: "credit" | "debit",
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    balance: number;
    totalCredits: number;
    totalDebits: number;
    transactions: ITransaction[];
    totalTransactions: number;
  }> {
    try {
      const wallet =
        (await WalletModel.findOne({ userId })) ||
        new WalletModel({ userId, balance: 0 });
      const query: any = { userId };
      if (type) query.type = type;
      if (startDate && endDate) {
        query.createdAt = { $gte: startDate, $lte: endDate };
      }

      const [transactions, totalTransactions, totalCredits, totalDebits] =
        await Promise.all([
          TransactionModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(),
          TransactionModel.countDocuments(query),
          TransactionModel.aggregate([
            {
              $match: {
                userId,
                type: "credit",
                ...(startDate && endDate
                  ? { createdAt: { $gte: startDate, $lte: endDate } }
                  : {}),
              },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]).then((res) => res[0]?.total || 0),
          TransactionModel.aggregate([
            {
              $match: {
                userId,
                type: "debit",
                ...(startDate && endDate
                  ? { createdAt: { $gte: startDate, $lte: endDate } }
                  : {}),
              },
            },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ]).then((res) => res[0]?.total || 0),
        ]);

      return {
        balance: wallet.balance,
        totalCredits,
        totalDebits,
        transactions,
        totalTransactions,
      };
    } catch (error) {
      throw new CustomError(
        "failed to fetch wallet data",
        HttpResCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
