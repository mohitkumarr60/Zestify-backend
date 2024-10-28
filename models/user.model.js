import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    cart: [
      {
        itemId: String,
        quantity: Number,
      },
    ],
    orders: [
      {
        itemId: String,
        quantity: Number,
        date: Date,
        status: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
