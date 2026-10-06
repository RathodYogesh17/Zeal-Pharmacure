import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import connectDatabase from "../src/config/database/database";
import User from "../src/models/user.model";
import { USER_ROLES } from "../src/constants/enums";
import { hashPassword } from "../src/utils/password";
import { resolveRoleId } from "../src/utils/resolveRole";

const envPath = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
].find((filePath) => fs.existsSync(filePath));

dotenv.config(envPath ? { path: envPath } : {});

const seedAdmin = async (): Promise<void> => {
  try {
    await connectDatabase();

    const adminName = process.env.SUPER_ADMIN_NAME || "Super Admin";
    const adminEmail = (process.env.SUPER_ADMIN_EMAIL || "admin@zealpharma.com").trim().toLowerCase();
    const adminPhone = (process.env.SUPER_ADMIN_PHONE || "9999999999").trim();
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || "Admin@123456";

    const existingUser = await User.findOne({
      $or: [{ email: adminEmail }, { phone: adminPhone }],
    });

    const superAdminRole = await resolveRoleId(USER_ROLES.SUPER_ADMIN);

    if (existingUser) {
      if (String(existingUser.role) === String(superAdminRole) && !existingUser.isDeleted && existingUser.isActive) {
        console.log(`[SEED] Super Admin already exists: ${existingUser.email}`);
        process.exit(0);
      }

      existingUser.role = superAdminRole;
      existingUser.isActive = true;
      existingUser.isDeleted = false;
      existingUser.isEmailVerified = true;
      await existingUser.save();

      console.log(`[SEED] Existing user updated to Super Admin: ${existingUser.email}`);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(adminPassword);

    const superAdmin = await User.create({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: superAdminRole,
      isActive: true,
      isDeleted: false,
      isEmailVerified: true,
    });

    console.log("=========================================");
    console.log("Super Admin seeded successfully!");
    console.log(`Email: ${superAdmin.email}`);
    console.log(`Phone: ${superAdmin.phone}`);
    console.log(`Role:  ${superAdmin.role}`);
    console.log("=========================================");

    process.exit(0);
  } catch (error: unknown) {
    console.error("Super Admin seed failed:", error);
    process.exit(1);
  }
};

seedAdmin();
