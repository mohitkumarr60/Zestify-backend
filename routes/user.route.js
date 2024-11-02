import express from "express";
import {
  addAddress,
  addToCart,
  getAllUsers,
  getCartItems,
  loginUser,
  logoutUser,
  registerUser,
  removeFromCart,
  updateUserById,
  updateUserPasswordById,
  verifyUser,
} from "../controllers/user.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/verify", verifyUser);

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/get-users", isAuthenticated, isAdmin, getAllUsers);

userRouter.put("/update-user", isAuthenticated, updateUserById);

userRouter.put("/update-address", isAuthenticated, addAddress);

userRouter.put(
  "/update-user-password",
  isAuthenticated,
  updateUserPasswordById
);

userRouter.get("/get-cart", isAuthenticated, getCartItems);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.post("/add-to-cart", isAuthenticated, addToCart);

userRouter.delete("/remove-from-cart", isAuthenticated, removeFromCart);

export default userRouter;
