import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { RESPONSE } from "../globals/api.js";

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
});

const getUrlImage = async (req, res, next) => {
    const { id, kiot_id } = req.users;
    const file = req.file;
    const { product_name, price, category, description } = JSON.parse(
        JSON.stringify(req.body)
    ); // req.body = [Object: null prototype] { title: 'product' }

    if (!file) {
        return next();
    }

    try {
        if (!product_name || !price || !category || !description)
            throw new Error("Missing required fields");

        const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "final_project_kiot",
        });

        req.imageUrl = result.secure_url;

        fs.unlinkSync(file.path);

        next();
    } catch (e) {
        return res
            .status(400)
            .json(
                RESPONSE(
                    [],
                    "Unsuccessful upload cloudinary",
                    e.errors,
                    e.message
                )
            );
    }
};

export default getUrlImage;
