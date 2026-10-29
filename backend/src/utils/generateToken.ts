import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

const getSecret = (secretName: "JWT_ACCESS_SECRET" | "JWT_REFRESH_SECRET", fallbackDefault: string): string => {
  const secret = process.env[secretName]?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    console.warn(`[SECURITY WARNING] ${secretName} is not defined in environment variables! Using fallback key.`);
  }
  return fallbackDefault;
};

const generateAccessToken = (payload: Record<string, unknown>): string => {
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES as SignOptions["expiresIn"]) || "15d";
  const secret = getSecret("JWT_ACCESS_SECRET", "zeal_pharma_production_access_key_2026_secured");
  return jwt.sign(payload, secret, { expiresIn });
};

const generateRefreshToken = (payload: Record<string, unknown>): string => {
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES as SignOptions["expiresIn"]) || "30d";
  const secret = getSecret("JWT_REFRESH_SECRET", "zeal_pharma_production_refresh_key_2026_secured");
  return jwt.sign(payload, secret, { expiresIn });
};

export { generateAccessToken, generateRefreshToken };
