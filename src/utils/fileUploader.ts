import multer from "multer";
import path from "path";
import fs from "fs";
import {
  createFileFilter,
  createStorage,
  DEFAULT_UPLOAD_DIRECTORY,
  FILE_TYPES,
} from "@config/fileUpload";

export class FileUploader {
  // Single file upload
  static singleUpload(
    fieldName: string,
    destination?: string,
    allowedTypes: string[] = FILE_TYPES.IMAGE,
  ) {
    // Use provided destination or default
    const uploadPath = destination || DEFAULT_UPLOAD_DIRECTORY;

    return multer({
      storage: createStorage(uploadPath),
      fileFilter: createFileFilter(allowedTypes),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }).single(fieldName);
  }

  // Multiple file upload
  static multipleUpload(
    fieldName: string,
    destination?: string,
    maxCount: number = 5,
    allowedTypes: string[] = FILE_TYPES.IMAGE,
  ) {
    // Use provided destination or default
    const uploadPath = destination || DEFAULT_UPLOAD_DIRECTORY;

    return multer({
      storage: createStorage(uploadPath),
      fileFilter: createFileFilter(allowedTypes),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: maxCount,
      },
    }).array(fieldName, maxCount);
  }

  // Delete file
  static deleteFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }

  // Get file URL
  static getFileUrl(req: any, filename: string) {
    return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
  }
}
