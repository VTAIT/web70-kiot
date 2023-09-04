import { RESPONSE } from "../globals/api.js";
import {
    image_create,
    image_getAll,
    image_getAllByKiot,
    image_getById,
    image_getByName,
    image_updateById,
} from "../services/mongo/image.js";
import { uploadStream } from "../middlewares/multer.js";
import { ResponseFields } from "../globals/fields/response.js";
import { env } from "../globals/config.js";

export const getAll = async (req, res) => {
    try {
        const { kiot_id, role } = req.users;

        let cussor = req.query[ResponseFields.cussor];
        if (!Number(cussor)) cussor = -1;

        let imageFromDb = [];

        // supper admin
        if (role === 1) {
            imageFromDb = await image_getAll(cussor);
        } else {
            imageFromDb = await image_getAllByKiot(kiot_id, cussor);
        }
        res.send(
            RESPONSE(
                {
                    [ResponseFields.imageList]: imageFromDb,
                    [ResponseFields.cussor]: imageFromDb.slice(-1)[0]._id - 1,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const getById = async (req, res) => {
    const id = req.query[ResponseFields.did];

    try {
        if (!id) throw new Error("Missing required fields");

        const imageFromDb = await image_getById(id);

        res.send(
            RESPONSE(
                {
                    [ResponseFields.imageInfo]: imageFromDb,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const create = async (req, res) => {
    try {
        const body = JSON.parse(JSON.stringify(req.body));
        const { kiot_id, name_file } = body;

        const src = await uploadStream(req.file.buffer);

        if (!kiot_id || !name_file || !src)
            throw new Error("Missing required fields");

        const result = await image_create({
            kiot_id,
            name_file,
            src: `${env.BASE_URL_IMAGE}/${src.public_id}`,
        });
        res.send(
            RESPONSE(
                {
                    [ResponseFields.imageInfo]: result,
                },
                "Create successful"
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE([], "Create unsuccessful", e.errors, e.message)
        );
    }
};

export const update = async (req, res) => {
    const { imageId, name_file, active } = req.body;

    try {
        if (!imageId) throw new Error("Missing required fields");

        const result = await image_updateById({
            imageId,
            name_file,
            active: Boolean(active),
        });

        res.send(
            RESPONSE(
                {
                    [ResponseFields.productInfo]: result,
                },
                "Update successful"
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE([], "Update unsuccessful", e.errors, e.message)
        );
    }
};
