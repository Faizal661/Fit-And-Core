import { Schema, model, Types, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: "credit" | "debit";
  amount: number;
  description: string;
  category: string;
  status: "completed" | "pending" | "failed";
  createdAt: Date;
  referenceId?: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, enum: ["completed", "pending", "failed"], default: "completed" },
    referenceId: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);




export interface IWallet extends Document {
  userId: Types.ObjectId;
  balance: number;
}

const WalletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, default: 0 },
});

export const WalletModel = model<IWallet>("Wallet", WalletSchema);