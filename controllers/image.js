import { RESPONSE } from "../globals/api.js";
import { Fields } from "../globals/fields.js";
import { image_create, image_getAll, image_getAllByKiot } from "../services/mongo/image.js";
import { uploadStream } from "../middlewares/multer.js";

export const getAll = async (req, res) => {
    try {
        const { kiot_id, role } = req.users;

        let cussor = req.query[Fields.cussor];
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
                    [Fields.imageList]: imageFromDb,
                    [Fields.cussor]: imageFromDb.slice(-1)[0]._id - 1
                },
                "Successful",
            )
        );

    } catch (e) {
        console.log(e)
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const getById = async (req, res) => {
    const id = req.query[Fields.did];

    try {
        if (!id) throw new Error("Missing required fields");

        const productFromDb = await product_getById(id);

        res.send(
            RESPONSE(
                {
                    [Fields.productInfo]: productFromDb
                },
                "Successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const create = async (req, res) => {
    try {
        const { kiot_id } = req.body;
        const name_file = await uploadStream(req.file.buffer);

        if (
            !kiot_id
            || !name_file
        ) throw new Error("Missing required fields");

        const result = await image_create({
            kiot_id,
            name_file: name_file.public_id
        });
        res.send(
            RESPONSE(
                {
                    [Fields.imageInfo]: result
                },
                "Create successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Create unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};