import { RESPONSE } from "../globals/api.js";
import { Fields } from "../globals/fields.js";
import { product_create, product_getAll, product_getAllByKiot, product_getById, product_getByName, product_updateById } from "../services/mongo/product.js";
import { saleoff_getAll } from "../services/mongo/saleoff.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let productFromDb = [];
    let saleOffProductList = [];
    let saleOffTransactionList = [];

    try {
        // supper admin
        if (role === 1) {
            productFromDb = await product_getAll();
            const saleOffFromDb = await saleoff_getAll();
            saleOffFromDb.forEach(e => {
                const type = e.type;
                if (type === 1) {
                    saleOffProductList.push(e);
                } else if (type === 2) {
                    saleOffTransactionList.push(e)
                }
            })
        } else {
            productFromDb = await product_getAllByKiot(kiot_id);
            const saleOffFromDb = await saleoff_getAll();
            saleOffFromDb.forEach(e => {
                const type = e.type;
                if (type === 1) {
                    saleOffProductList.push(e);
                } else if (type === 2) {
                    saleOffTransactionList.push(e)
                }
            })
        }
        res.send(
            RESPONSE(
                {
                    [Fields.productList]: productFromDb,
                    [Fields.saleOffProductList]: saleOffProductList,
                    [Fields.saleOffTransactionList]: saleOffTransactionList
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

export const getById = async (req, res) => {
    const id = req.query["Did"];

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
    const { id } = req.users;
    const { name_product, price, image, category, kiot_id } = req.body;
    try {
        if (!kiot_id
            || !name_product
            || !price
            || !category
        ) throw new Error("Missing required fields");

        if (await product_getByName(name_product, kiot_id)) throw new Error("Product has already exist");

        const result = await product_create({
            kiot_id,
            name_product,
            price,
            image,
            id,
            category,
        });
        res.send(
            RESPONSE(
                {
                    [Fields.productInfo]: result
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

export const update = async (req, res) => {
    const {
        productId,
        active,
        name_product,
        price,
        image,
        category,
        code
    } = req.body;
    try {
        if (!productId) throw new Error("Missing required fields");

        const result = await product_updateById({
            productId,
            active,
            name_product,
            price,
            image,
            category,
            code
        });
        res.send(
            RESPONSE(
                {
                    [Fields.productInfo]: result
                },
                "Update successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Update unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};
