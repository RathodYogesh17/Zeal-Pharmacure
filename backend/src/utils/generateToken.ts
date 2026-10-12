import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";


const generateAccessToken = (payload: Record<string, unknown>): string => {
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"]) || "15d";
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || "access_secret", { expiresIn });
};

const generateRefreshToken = (payload: Record<string, unknown>): string => {
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"]) || "30d";
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "refresh_secret", { expiresIn });
};

export {  generateAccessToken, generateRefreshToken,};