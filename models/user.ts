import mongoose, { Schema } from "mongoose";
import { UserType } from "../types/user";

const userSchema = new Schema<UserType>({
  // _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
});

const User =
  mongoose.models.User || mongoose.model<UserType>("User", userSchema);

export default User;
