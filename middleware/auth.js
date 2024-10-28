import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res
      .status(401)
      .json({ message: "Please login to access this resource" });
  }

  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid access token" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "Please login to access this resource" });
  }
  req.user = user;
  next();
};

export const isAdmin = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) {
    return res
      .status(401)
      .json({ message: "Please login to access this resource" });
  }

  if (user.isAdmin === false) {
    return res
      .status(403)
      .json({ message: "You are not authorized to access this resource" });
  }
  next();
};
