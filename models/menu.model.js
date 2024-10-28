import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userId: String,
      rating: Number,
      comment: String,
    },
  ],
});

const MenuItem = mongoose.model("MenuItem", MenuSchema);

export default MenuItem;
