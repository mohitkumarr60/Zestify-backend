import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    categories: {
      type: [String],
      required: true,
    },
  },
);

const Category = mongoose.model("Category", CategorySchema);
export default Category;