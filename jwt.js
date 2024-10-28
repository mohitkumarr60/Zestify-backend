import "dotenv/config";
import jwt from "jsonwebtoken";

export const accessToken = (user) => {
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

