import { Router } from "express";

import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { productRouter } from "./product.route";
import { categoryRouter } from "./category.route";
import { subCategoryRouter } from "./subCategory.route";
import { indicationRouter } from "./indication.route";
import { enquiryRouter } from "./enquiry.route";
import { careerRouter } from "./career.route";
import { galleryRouter } from "./gallery.route";
import { contentRouter } from "./content.route";
import { dashboardRouter } from "./dashboard.route";
import { settingsRouter } from "./settings.route";
import { auditLogRouter } from "./auditLog.route";
import { whatsappBotRouter } from "./whatsappBot.route";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "Zeal Pharma API is healthy and operational" });
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/subcategories", subCategoryRouter);
router.use("/indications", indicationRouter);
router.use("/enquiries", enquiryRouter);
router.use("/careers", careerRouter);
router.use("/gallery", galleryRouter);
router.use("/content", contentRouter);
router.use("/dashboard", dashboardRouter);
router.use("/settings", settingsRouter);
router.use("/audit-logs", auditLogRouter);
router.use("/whatsapp-bot", whatsappBotRouter);

export default router;
