import express from "express";
import {
  addNewItem,
  getAllItems,
  getItemById,
  updateItemById,
  deleteItemById,
} from "../controllers/menu.controller.js";
import { isAdmin, isAuthenticated } from "../middleware/auth.js";

const menuRouter = express.Router();

menuRouter.post("/add-new-item", isAuthenticated, isAdmin, addNewItem);

menuRouter.get("/get-all-items", getAllItems);

menuRouter.get("/get-item/:id", isAuthenticated, getItemById);

menuRouter.put("/update-item/:id", isAuthenticated, isAdmin, updateItemById);

menuRouter.delete("/delete-item/:id", isAuthenticated, isAdmin, deleteItemById);

export default menuRouter;
