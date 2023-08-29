import { limit } from "../../globals/config.js";
import { Fields } from "../../globals/fields.js";
import { ProductModel } from "../../globals/mongodb.js";

export const product_create = async (data) => {
    const {
        kiot_id,
        product_name,
        price,
        image,
        user_id,
        category,
        description,
    } = data;

    const productDoc = new ProductModel({
        // _id: 0,
        kiot_id,
        product_name,
        price,
        image: image
            ? image
            : "http://dummyimage.com/420x420.png/dddddd/000000",
        user_id,
        category,
        code: "",
        active: true,
        description,
    });

    return await productDoc.save();
};

export const product_updateById = async (data) => {
    const { productId, active, name_product, price, image, category, code } =
        data;

    const existingProduct = await product_getById(productId);

    if (!existingProduct) throw new Error("Customer not already exist");
    if (name_product === existingProduct.name_product)
        throw new Error("Product has already exist");

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

export const product_getAll = async (cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }

    return await ProductModel.find(query)
        .sort({ [Fields.id]: -1 })
        .limit(limit);
};

export const product_getById = async (id) => {
    return await ProductModel.findOne({ _id: id });
};

export const product_getByName = async (product_name, kiot_id, category) => {
    return await ProductModel.findOne({
        product_name: product_name,
        kiot_id: kiot_id,
        category: category,
    });
};

export const product_getAllByKiot = async (kiot_id, cussor = -1) => {
    let query = { kiot_id: kiot_id };

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }

    return await ProductModel.find(query)
        .sort({ [Fields.id]: -1 })
        .limit(limit);
};
