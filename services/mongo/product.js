import { ProductModel } from "../../globals/mongodb.js";

export const product_create = async (data) => {
    const {
        name_product,
        price,
        image,
        kiot_id,
        category,
        id,
    } = data;

    const productDoc = new ProductModel({
        kiot_id,
        name_product,
        price,
        image: image ? image : "",
        user_id: id,
        category,
        code: "",
        active: true
    });

    return await productDoc.save();
};

export const product_updateById = async (data) => {
    const {
        productId,
        active,
        name_product,
        price,
        image,
        category,
        code
    } = data;

    const existingProduct = await product_getById(productId);

    if (!existingProduct) throw new Error("Customer not already exist");
    if (name_product === existingProduct.name_product) throw new Error("Product has already exist");

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

    return await existingProduct.save();
};

export const product_getAll = async () => {
    return await ProductModel.find({});
};

export const product_getById = async (id) => {
    return await ProductModel.findOne({ _id: id });
};

export const product_getByName = async (name_product, kiot_id) => {
    return await ProductModel.findOne({ name_product: name_product, kiot_id: kiot_id });
};

export const product_getAllByKiot = async (kiot_id) => {
    return await ProductModel.find({ kiot_id: kiot_id });
};