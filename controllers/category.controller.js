import Category from "../models/category.model.js";

// function to add category (only by admin)
export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      {},
      { $addToSet: { categories: category } },
      { upsert: true, new: true }
    );

    res
      .status(200)
      .json({ message: "Category added Successfully", updatedCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// function to get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// function to delete a category (only by admin)
export const deleteCategory = async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      {},
      { $pull: { categories: category } },
      { new: true }
    );

    res.status(200).json({ message: "Category Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
