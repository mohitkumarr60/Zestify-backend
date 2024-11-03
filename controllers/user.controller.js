import User from "../models/user.model.js";
import MenuItem from "../models/menu.model.js";
import jwt from "jsonwebtoken";
import { accessToken } from "../jwt.js";
import bcrypt from "bcrypt";

// verify user
export const verifyUser = async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Please login to access this resource" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(200).json({ isAuthenticated: true, user: user });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(403).json({ message: "Invalid token" });
  }
};

// function to register new user
export const registerUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// function to login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create access token
    const userDetails = { email: user.email, id: user._id };
    const token = accessToken(userDetails);

    // set secure cookie
    res.cookie("accessToken", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      maxAge: 3 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      domain: "railway.app",
    });

    // send success response
    res.status(200).json({
      message: "User logged in successfully",
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// function to get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update user information by id
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.user;
    // check whether the user exist or not first
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update user password by id
export const updateUserPasswordById = async (req, res) => {
  try {
    const { id } = req.user;
    // check the old password is correct or not
    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    // hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// function to logout user
export const logoutUser = async (req, res) => {
  try {
    res.cookie("accessToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// function to add item to cart
export const addToCart = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the item already exists in the cart; if so, increment the quantity
    const existingItem = user.cart.find(
      (item) => item.itemId.toString() === req.body.itemId.toString()
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // Add new item with quantity 1
      user.cart.push({ itemId: req.body.itemId, quantity: 1 });
    }

    await user.save();
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function to remove an item from the cart
export const removeFromCart = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // decrease the quantity by 1 or remove the item if quantity is 1
    const existingItem = user.cart.find(
      (item) => item.itemId.toString() === req.body.itemId.toString()
    );
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    if (existingItem.quantity === 1) {
      user.cart = user.cart.filter(
        (item) => item.itemId.toString() !== req.body.itemId.toString()
      );
    } else {
      existingItem.quantity -= 1;
    }

    await user.save();
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function to delete an item from the cart
export const deleteFromCart = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove the item from the cart
    user.cart = user.cart.filter(
      (item) => item.itemId.toString() !== req.body.itemId.toString()
    );

    await user.save();
    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function to get cart items of user
export const getCartItems = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // filter the menu items based on the id present in the user.cart
    const menuItems = await MenuItem.find({
      _id: { $in: user.cart.map((item) => item.itemId) },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// function to update address to user or add if not exist
export const addAddress = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.address = req.body.address;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
