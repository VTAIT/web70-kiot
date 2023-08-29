import { RESPONSE } from "../globals/api.js";
import { Fields } from "../globals/fields.js";
import { ProductModel } from "../globals/mongodb.js";

import {
    product_create,
    product_getAll,
    product_getAllByKiot,
    product_getById,
    product_getByName,
    product_updateById,
} from "../services/mongo/product.js";
import { saleoff_getAll } from "../services/mongo/saleoff.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;
    console.log(req.users);
    let productFromDb = [];
    let saleOffProductList = [];
    let saleOffTransactionList = [];

    try {
        // supper admin
        if (role === 1) {
            productFromDb = await product_getAll();
            const saleOffFromDb = await saleoff_getAll();
            saleOffFromDb.forEach((e) => {
                const type = e.type;
                if (type === 1) {
                    saleOffProductList.push(e);
                } else if (type === 2) {
                    saleOffTransactionList.push(e);
                }
            });
        } else {
            productFromDb = await product_getAllByKiot(kiot_id);
            const saleOffFromDb = await saleoff_getAll();
            saleOffFromDb.forEach((e) => {
                const type = e.type;
                if (type === 1) {
                    saleOffProductList.push(e);
                } else if (type === 2) {
                    saleOffTransactionList.push(e);
                }
            });
        }
        res.json(
            RESPONSE(
                {
                    [Fields.productList]: productFromDb,
                    [Fields.saleOffProductList]: saleOffProductList,
                    [Fields.saleOffTransactionList]: saleOffTransactionList,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).json(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const getById = async (req, res) => {
    const id = req.query["Did"];

    try {
        if (!id) throw new Error("Missing required fields");

        const productFromDb = await product_getById(id);

        res.json(
            RESPONSE(
                {
                    [Fields.productInfo]: productFromDb,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).json(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const create = async (req, res) => {
    const { id, kiot_id } = req.users;
    const image = req.imageUrl;

    const { product_name, price, category, description } = JSON.parse(
        JSON.stringify(req.body)
    ); // req.body = [Object: null prototype] { title: 'product' }

    console.log(image);
    console.log({ product_name, price, category, description });
    try {
        if (
            !kiot_id ||
            !product_name ||
            !price ||
            !category ||
            !description ||
            !image
        )
            throw new Error("Missing required fields");

        const exist = await product_getByName(product_name, kiot_id, category);

        if (await product_getByName(product_name, kiot_id, category))
            throw new Error("Product has already exist");

        const result = await product_create({
            kiot_id,
            product_name,
            price,
            image,
            user_id: id,
            category,
            description,
        });
        res.json(
            RESPONSE(
                {
                    [Fields.productInfo]: result,
                },
                "Create successful"
            )
        );
    } catch (e) {
        res.status(400).json(
            RESPONSE([], "Create unsuccessful", e.errors, e.message)
        );
    }
};

export const update = async (req, res) => {
    const { productId, active, product_name, price, image, category, code } =
        req.body;
    try {
        if (!productId) throw new Error("Missing required fields");

        const result = await product_updateById({
            productId,
            active,
            product_name,
            price,
            image,
            category,
            code,
        });
        res.json(
            RESPONSE(
                {
                    [Fields.productInfo]: result,
                },
                "Update successful"
            )
        );
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).json({
            error: messages,
            message: "Update unsuccessful",
            catch: e.message,
        });
    }
};
