import multer from "multer";
import { Readable } from "stream";
import { v2 as cloudinary } from 'cloudinary';
import { env } from "../globals/config.js";

const storage = multer.memoryStorage();

cloudinary.config({
    cloud_name: env.CLOUDNAME,
    api_key: env.API_KEY_CLOUDINARY,
    api_secret: env.API_SECRET_CLOUDINARY,
    stream: true
});

export async function uploadStream(buffer) {
    return new Promise((res, rej) => {
        const theTransformStream = cloudinary.uploader.upload_stream(
            { folder: "kiot" },
            (err, result) => {
                if (err) return rej(err);
                res(result);
            }
        );
        let str = Readable.from(buffer);
        str.pipe(theTransformStream);
    });
}

export const uploadFile = multer({ storage });
