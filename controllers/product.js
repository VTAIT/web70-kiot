import { ProductModel } from "../globals/mongodb.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let productFromDb = [];

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
    const { kiot_id, role } = req.users;
    const _id = req.query["Did"];

    let kiotFromDb = [];

    // supper admin
    if (role === 1) {
        kiotFromDb = await ProductModel.find({ _id });
    } else {
        if (kiot_id) {
            kiotFromDb = await ProductModel.find({ kiot_id });
        }
    }

    res.send({
        data: kiotFromDb,
        message: "Thành công"
    });
};

export const create = async (req, res) => {
    const { id, role, kiot_id } = req.users;
    const { name_product, price, image } = req.body;

    if (!kiot_id || !name_product || !price) {
        return res.send({ messeger: 'Missing information' });
    }

    const productFromDb = await ProductModel.findOne({ name_product, kiot_id });
    if (productFromDb) {
        return res.send({ messeger: 'Product already exist' });
    }

    const category = 0;
    const code = ""

    const productDoc = new ProductModel({
        kiot_id,
        name_product,
        price,
        image,
        user_id: id,
        category,
        code,
        active: true
    });

    try {
        const respones = await productDoc.save();
        res.send({
            data: respones,
            message: "Thêm thành công"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Thêm không thành công"
        });
    }
};

export const update = async (req, res) => {
    const { id, role, kiot_id } = req.users;
    const { productId, active, name_product, price, image, category, code } = req.body;

    if (!productId || !name_product || !price || !category) {
        return res.send({ messeger: 'Missing information' });
    }

    let existingProduct = await ProductModel.findOne({ name_product });
    if (existingProduct) {
        return res.json({
            message: "Product name already exist",
        });
    }

    existingProduct = await ProductModel.findOne({ _id: productId });
    if (!existingProduct) {
        return res.json({
            message: "Product not already exist",
        });
    }

    if (name_product) {
        existingProduct.name_product = name_product;
    }

    if (price) {
        existingProduct.price = price;
    }

    if (image) {
        existingProduct.image = image;
    }

    if (active != existingProduct.active) {
        existingProduct.active = active;
    }

    if (category) {
        existingProduct.category = category;
    }

    if (code) {
        existingProduct.code = code;
    }

    try {
        const susscess = await existingProduct.save();
        if (!susscess) {
            return res.send({ message: 'unsuccessful' });
        }

        res.send({
            message: "Update successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Update unsuccessful"
        });
    }
};
