import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME_CLOUDINARY,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRECT_CLOUDINARY,
});

const getUrlImage = async (req, res, next) => {
    const file = req.file;

    try {
        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "final_project_kiot",
        });

        req.imageUrl = result.secure_url;

        fs.unlinkSync(file.path);

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error uploading image to Cloudinary" });
    }
};

export default getUrlImage;
