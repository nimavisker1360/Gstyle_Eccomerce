import { IUserInput } from "@/types";
import {
  Document,
  // InferSchemaType,
  Model,
  model,
  models,
  Schema,
} from "mongoose";

export interface IUser extends Document, IUserInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true, default: "User" },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
    paymentMethod: { type: String },
    address: {
      fullName: { type: String },
      street: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
      country: { type: String },
      phone: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const User = (models.User as Model<IUser>) || model<IUser>("User", userSchema);

export default User;
