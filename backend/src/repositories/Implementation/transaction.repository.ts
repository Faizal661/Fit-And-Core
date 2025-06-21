import { injectable } from "tsyringe";
import { Types } from "mongoose";
import {
  WalletModel,
  TransactionModel,
  ITransaction,
} from "../../models/wallet.models";
import { CustomError } from "../../errors/CustomError";
import { HttpResCode } from "../../constants/http-response.constants";
import { BaseRepository } from "./base.repository";

@injectable()
export class WalletRepository extends BaseRepository<ITransaction>{
  
}
