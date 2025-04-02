import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { ValidationError } from "@utils/errors";

export const FILE_TYPES = {
  IMAGE: ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  VIDEO: ["video/mp4", "video/mpeg", "video/quicktime"],
};

const DEFAULT_UPLOAD_DIR = path.join(process.cwd(), "uploads");

if (!fs.existsSync(DEFAULT_UPLOAD_DIR)) {
  fs.mkdirSync(DEFAULT_UPLOAD_DIR, { recursive: true });
}

export const createStorage = (destination?: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadPath = destination || DEFAULT_UPLOAD_DIR;

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    },
  });

export const createFileFilter =
  (allowedTypes: string[]) =>
  (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new ValidationError({
          message: "Invalid file type",
          fileType: file.mimetype,
          allowedTypes: allowedTypes,
          fieldName: file.fieldname,
        }),
      );
    }
  };

export const DEFAULT_UPLOAD_DIRECTORY = DEFAULT_UPLOAD_DIR;
