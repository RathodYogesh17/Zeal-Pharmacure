import { v2 as cloudinary, type UploadApiResponse, type UploadApiOptions } from "cloudinary";

// Initialize Cloudinary
const getCloudinaryConfig = () => {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const api_key = process.env.CLOUDINARY_API_KEY?.trim();
  const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloud_name || !api_key || !api_secret) {
    return null;
  }

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
  });

  return { cloud_name, api_key, api_secret };
};

export const isCloudinaryConfigured = (): boolean => {
  return Boolean(getCloudinaryConfig());
};

export interface ICloudinaryUploadResult {
  url: string;
  publicId: string;
  bytes: number;
  format?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

const resolveCloudinaryFolder = (folderName?: string): string => {
  const norm = (folderName || "gallery").toLowerCase().trim();
  if (norm.includes("product")) return "zeal-pharma/products";
  if (norm.includes("profile") || norm.includes("staff") || norm.includes("user")) return "zeal-pharma/profiles";
  if (norm.includes("banner") || norm.includes("cms") || norm.includes("hero")) return "zeal-pharma/banners";
  if (norm.includes("logo") || norm.includes("brand") || norm.includes("cert")) return "zeal-pharma/logos";
  if (norm.includes("resume") || norm.includes("doc")) return "zeal-pharma/resumes";
  return `zeal-pharma/${norm}`;
};

/**
 * Uploads an image file to Cloudinary
 */
export const uploadImageToCloudinary = async (
  filePathOrBuffer: string | Buffer,
  options: {
    folder?: string | undefined;
    publicId?: string | undefined;
    tags?: string[] | undefined;
  } = {}
): Promise<ICloudinaryUploadResult> => {
  getCloudinaryConfig();

  const folder = resolveCloudinaryFolder(options.folder);

  const uploadOptions: UploadApiOptions = {
    folder,
    resource_type: "image",
    overwrite: true,
  };

  if (options.publicId) uploadOptions.public_id = options.publicId;
  if (options.tags && options.tags.length > 0) uploadOptions.tags = options.tags;

  if (typeof filePathOrBuffer === "string") {
    const result: UploadApiResponse = await cloudinary.uploader.upload(filePathOrBuffer, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  }

  // Upload buffer via stream
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        return reject(error || new Error("Cloudinary upload failed"));
      }
      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
      });
    });
    uploadStream.end(filePathOrBuffer);
  });
};

/**
 * Uploads a document/raw file (such as a PDF resume) to Cloudinary
 */
export const uploadRawToCloudinary = async (
  filePathOrBuffer: string | Buffer,
  options: {
    folder?: string | undefined;
    publicId?: string | undefined;
    originalName?: string | undefined;
  } = {}
): Promise<ICloudinaryUploadResult> => {
  getCloudinaryConfig();

  const folder = options.folder ? `zeal-pharma/${options.folder.toLowerCase()}` : "zeal-pharma/resumes";

  const uploadOptions: UploadApiOptions = {
    folder,
    resource_type: "raw",
    use_filename: true,
    unique_filename: true,
  };

  if (options.publicId) uploadOptions.public_id = options.publicId;

  if (typeof filePathOrBuffer === "string") {
    const result: UploadApiResponse = await cloudinary.uploader.upload(filePathOrBuffer, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      bytes: result.bytes,
      format: result.format,
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        return reject(error || new Error("Cloudinary raw upload failed"));
      }
      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        bytes: result.bytes,
        format: result.format,
      });
    });
    uploadStream.end(filePathOrBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: "image" | "raw" = "image"
): Promise<void> => {
  if (!isCloudinaryConfigured() || !publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn(`[CLOUDINARY] Failed to delete asset ${publicId}:`, err);
  }
};
