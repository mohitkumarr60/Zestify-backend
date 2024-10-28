import express from "express";
;
import { isAdmin, isAuthenticated } from "../middleware/auth.js";
import { addCategory, deleteCategory, getAllCategories } from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post(
  "/add-category",
  isAuthenticated,
  isAdmin,
  addCategory
);

categoryRouter.get(
  "/get-categories",
  isAuthenticated,
  isAdmin,
  getAllCategories
);

categoryRouter.delete(
  "/delete-category",
  isAuthenticated,
  isAdmin,
  deleteCategory
);

export default categoryRouter;
