import { product_create, product_getAll, product_getAllByKiot, product_getById, product_getByName, product_updateById } from "../services/mongo/product.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let productFromDb = [];

    try {
        // supper admin
        if (role === 1) {
            productFromDb = await product_getAll();
        } else {
            productFromDb = await product_getAllByKiot(kiot_id);
        }

        res.send({
            data: productFromDb,
            message: "Successful"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Unsuccessful",
            catch: e.message
        });
    }

    // supper admin
    if (role === 1) {
        productFromDb = await ProductModel.find({});
    } else {
        if (kiot_id) {
            productFromDb = await ProductModel.find({ kiot_id });
        }
    }

    res.send({
        data: productFromDb,
        message: "Thành công"
    });
};

export const getById = async (req, res) => {
    const id = req.query["Did"];

    try {
        if (!id) throw new Error("Missing required fields");

        const productFromDb = await product_getById(id);

        res.send({
            data: productFromDb,
            message: "Successful"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Unsuccessful",
            catch: e.message
        });
    }
};

export const create = async (req, res) => {
    const { id, kiot_id } = req.users;
    const { name_product, price, image, category } = req.body;
    try {
        if (!kiot_id
            || !name_product
            || !price
            || !category
        ) throw new Error("Missing required fields");

        if (await product_getByName(name_product, kiot_id)) throw new Error("Product has already exist");

        const result = new product_create({
            kiot_id,
            name_product,
            price,
            image,
            id,
            category,
        });

        res.send({
            data: result,
            message: "Create successfully"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Create unsuccessful",
            catch: e.message
        });
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

        res.send({
            data: result,
            message: "Update successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Update unsuccessful",
            catch: e.message
        });
    }
};
