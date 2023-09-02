import { RESPONSE } from "../globals/api.js";
import { ResponseFields } from "../globals/fields/response.js";
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

        const conditions = req.query;

        let productFromDb = [];
        let saleOffProductList = [];
        let saleOffTransactionList = [];

        // supper admin
        if (role === 1) {
            productFromDb = await product_getAll(conditions);

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
            productFromDb = await product_getAllByKiot(kiot_id, conditions);
            let array = [];
            productFromDb.forEach((e) => {
                array.push(e.name_product);
            });
            saleOffProductList = await saleoff_getByArray(array);
            saleOffTransactionList = await saleoff_getByTracsaction(kiot_id);
        }
        res.send(
            RESPONSE(
                {
                    [ResponseFields.productList]: productFromDb,
                    [ResponseFields.saleOffProductList]: saleOffProductList,
                    [ResponseFields.saleOffTransactionList]:
                        saleOffTransactionList,
                    // [ResponseFields.cussor]: productFromDb.slice(-1)[0]._id - 1,// error if productfromdb = []
                },
                "Successful"
            )
        );
    } catch (e) {
        console.log(e);
        res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const getById = async (req, res) => {
    const id = req.query[ResponseFields.did];

    try {
        if (!id) throw new Error("Missing required fields");

        const productFromDb = await product_getById(id);

        res.send(
            RESPONSE(
                {
                    [ResponseFields.productInfo]: productFromDb,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const create = async (req, res) => {
    const { id, kiot_id } = req.users;

    const data = req.body;
    const { name_product, price, category, description, active, image } = data;

    try {
        if (
            (!name_product || !price || !category || !description || !active,
            !image)
        )
            throw new Error("Missing required fields");

        const exist = await product_getByName(
            name_product,
            kiot_id ? kiot_id : data.kiot_id,
            category
        );

        if (exist) throw new Error("Product has already exist");

        const result = await product_create({
            kiot_id: kiot_id ? kiot_id : data.kiot_id,
            name_product,
            price,
            image,
            user_id: id,
            category,
            description,
            active,
        });
        res.send(
            RESPONSE(
                {
                    [ResponseFields.productInfo]: result,
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
    const data = req.body;

    const {
        productId,
        active,
        name_product,
        price,
        category,
        description,
        image,
    } = data;

    try {
        if (!productId) throw new Error("Missing required fields");

        const result = await product_updateById({
            productId,
            active,
            name_product,
            price,
            image,
            category,
            description,
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
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Update unsuccessful 1",
            catch: e.message,
        });
    }
};
