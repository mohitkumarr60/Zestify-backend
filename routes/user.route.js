import express from "express";
import {
  addToCart,
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
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

userRouter.put(
  "/update-user-password",
  isAuthenticated,
  updateUserPasswordById
);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.post('/add-to-cart', isAuthenticated, addToCart)

export default userRouter;
