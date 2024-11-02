import express from "express";
import {
  addAddress,
  addToCart,
  deleteFromCart,
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

userRouter.post("/add-address", isAuthenticated, addAddress);

userRouter.put(
  "/update-user-password",
  isAuthenticated,
  updateUserPasswordById
);

userRouter.get("/get-cart", isAuthenticated, getCartItems);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.post("/add-to-cart", isAuthenticated, addToCart);

userRouter.post("/remove-from-cart", isAuthenticated, removeFromCart);

userRouter.delete("/delete-from-cart", isAuthenticated, deleteFromCart);

export default userRouter;
