import express from "express";
import path from "path";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import HTTP_STATUS from "./constants/httpStatus";
import errorMiddleware from "./middleware/error.middleware";

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
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
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

// Health Check
app.get( "/health", ( _req: import("express").Request, res: import("express").Response ) => {
    res.status(HTTP_STATUS.OK).json({  success: true, message: "Zeal Pharma API is running", });
  }
);

// Main API Routes
app.use("/api", router);
app.use(errorMiddleware);

export default app;