import multer from "multer";
import fs from "fs";

const UPLOAD_DIRECTORY = "uploads";

if (!fs.existsSync(UPLOAD_DIRECTORY)) {
    fs.mkdirSync(UPLOAD_DIRECTORY);
}

const multerStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, UPLOAD_DIRECTORY);
    },
    filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileExtension = file.originalname.split(".").pop();
        const originalName = file.originalname.split(".")[0];
        const filename = `${originalName}-${uniqueSuffix}.${fileExtension}`;
        callback(null, filename);
    },
});

const uploadFile = multer({ storage: multerStorage });

export default uploadFile;
