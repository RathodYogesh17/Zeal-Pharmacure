import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const envPath = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
].find((filePath) => fs.existsSync(filePath));

dotenv.config(envPath ? { path: envPath } : {});

import "./models/user.model";
import "./models/media.model";
import "./models/category.model";
import "./models/subCategory.model";

import app from "./app";
import connectDatabase from "./config/database/database";
import whatsAppBotService from "./services/whatsappBot.service";
const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      void whatsAppBotService.initWhatsAppBot();
    });
  } catch (error: unknown) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();