import multer, { type FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import type { Request, Response, NextFunction } from "express";

const resumeDir = path.resolve(process.cwd(), "uploads", "resumes");

// Ensure uploads/resumes directory exists
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

type UploadedFile = Express.Multer.File;

const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: UploadedFile,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, resumeDir);
  },
  filename: (
    _req: Request,
    file: UploadedFile,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = file.originalname
      ? path.extname(file.originalname).toLowerCase()
      : ".pdf";
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: UploadedFile,
  cb: FileFilterCallback
) => {
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream", // Some browsers send binary stream for docs
  ];

  if (allowedExtensions.includes(ext) || allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only PDF, DOC, and DOCX files are allowed for resumes."));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum
  },
});

const uploadResume = upload.single("resume");

/**
 * Helper middleware that formats uploaded resume metadata into req.body
 */
const attachResumeMetadata = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.file) {
    req.body.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    req.body.resumeOriginalName = req.file.originalname;
    req.body.resumeMimeType = req.file.mimetype;
    req.body.resumeSize = req.file.size;
  }
  next();
};

export { resumeDir, uploadResume, attachResumeMetadata };
