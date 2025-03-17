import { model, Schema, Document } from "mongoose";
import { IUser } from "../types/user.types";

export interface IUserModel extends Document, Omit<IUser, "_id"> {
  phone: string | undefined;
  address: string | undefined;
  city: string | undefined;
  pinCode: string | undefined;
}

const userSchema = new Schema<IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "trainer"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/027/448/973/non_2x/avatar-account-icon-default-social-media-profile-photo-vector.jpg",
    },
    googleId: {
      type: String,
    },
    gender: { type: String },
    dateOfBirth: { type: Date },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    pinCode: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel = model<IUserModel>("User", userSchema);
export default UserModel;
