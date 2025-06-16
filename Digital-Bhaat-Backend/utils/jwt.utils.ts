import jwt from "jsonwebtoken";
import Env from "../config/Env.config"; // make sure this exports JWT_SECRET

const JWT_SECRET = Env.JWT_SECRET || "your_fallback_secret"; // fallback for safety

export const generateToken = (payload: object, ) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn:"7d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

