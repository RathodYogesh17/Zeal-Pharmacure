import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import HTTP_STATUS from "./constants/httpStatus";
import errorMiddleware from "./middleware/error.middleware";
import connectDatabase from "./config/database/database";

import "./models/user.model";
import "./models/role.model";
import "./models/media.model";
import "./models/category.model";
import "./models/subCategory.model";

import router from "./routes";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all valid origins dynamically (Vercel, Localhost, Custom Domain)
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  },
  express.static(path.resolve(process.cwd(), "uploads"))
);

// Root & Health Check
app.get("/", (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Zeal Pharmaceuticals API Server is Live & Running",
    status: "healthy",
  });
});

app.get( "/health", ( _req: import("express").Request, res: import("express").Response ) => {
    res.status(HTTP_STATUS.OK).json({  success: true, message: "Zeal Pharma API is running", });
  }
);

// Ensure DB connected (essential for Vercel serverless functions)
app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Main API Routes
app.use("/api", router);
app.use(errorMiddleware);

export default app;