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
import {
    saleoff_getByArray,
    saleoff_getByTracsaction,
} from "../services/mongo/saleoff.js";

export const getAll = async (req, res) => {
    try {
        const { kiot_id, role } = req.users;

        let cussor = req.query[Fields.cussor];
        if (!Number(cussor)) cussor = -1;

        let productFromDb = [];
        let saleOffProductList = [];
        let saleOffTransactionList = [];

        // supper admin
        if (role === 1) {
            productFromDb = await product_getAll(cussor);
            let array = [];
            productFromDb.forEach((e) => {
                array.push(e.name_product);
            });
            const saleOffFromDb = await saleoff_getByArray(array);
            saleOffFromDb.forEach((e) => {
                const type = e.type;
                if (type === 1) {
                    saleOffProductList.push(e);
                } else if (type === 2) {
                    saleOffTransactionList.push(e);
                }
            });
        } else {
            productFromDb = await product_getAllByKiot(kiot_id, cussor);
            let array = [];
            productFromDb.forEach((e) => {
                array.push(e.name_product);
            });
            saleOffProductList = await saleoff_getByArray(array);
            saleOffTransactionList = await saleoff_getByTracsaction(kiot_id);
        }
        res.json(
            RESPONSE(
                {
                    [Fields.productList]: productFromDb,
                    [Fields.saleOffProductList]: saleOffProductList,
                    [Fields.saleOffTransactionList]: saleOffTransactionList,
                    [Fields.cussor]: productFromDb.slice(-1)[0]._id - 1,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).json(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const getById = async (req, res) => {
    const id = req.query[Fields.did];

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

    const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

    const { product_name, price, category, description, active } = body;

    try {
        if (!product_name || !price || !category || !description || !active)
            throw new Error("Missing required fields");

        const exist = await product_getByName(
            product_name,
            kiot_id ? liot_id : body.kiot_id,
            category
        );

        if (exist) throw new Error("Product has already exist");

        const result = await product_create({
            kiot_id: kiot_id ? kiot_id : body.kiot_id,
            product_name,
            price,
            image,
            user_id: id,
            category,
            description,
            active,
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
    const image = req.imageUrl;

    const body = JSON.parse(JSON.stringify(req.body)); // req.body = [Object: null prototype] { title: 'product' }

    const { productId, active, product_name, price, category, description } =
        body;

    try {
        if (!productId) throw new Error("Missing required fields");

        const result = await product_updateById({
            productId,
            active,
            product_name,
            price,
            image,
            category,
            description,
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
            message: "Update unsuccessful 1",
            catch: e.message,
        });
    }
};
