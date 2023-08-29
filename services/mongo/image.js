import { limit } from "../../globals/config.js";
import { Fields } from "../../globals/fields.js";
import { ImageModel } from "../../globals/mongodb.js";

export const image_create = async (data) => {
    const {
        kiot_id,
        name_file
    } = data;

    const imageDoc = new ImageModel({
        _id: 0,
        kiot_id,
        name_file,
        active: true
    });

    return await imageDoc.save();
};

export const image_updateById = async (data) => {
    const {
        productId,
        active,
        name_product,
        price,
        image,
        category,
        code
    } = data;

    const existingProduct = await image_getById(productId);

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

export const image_getAll = async (cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }

    return await ImageModel.find(query).sort({ [Fields.id]: -1 }).limit(limit);
};

export const image_getById = async (id) => {
    return await ImageModel.findOne({ _id: id });
};

export const image_getByName = async (name_product, kiot_id) => {
    return await ImageModel.findOne({ name_product: name_product, kiot_id: kiot_id });
};

export const image_getAllByKiot = async (kiot_id, cussor = -1) => { 
    let query = { kiot_id: kiot_id };

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }

    return await ImageModel.find(query).sort({ [Fields.id]: -1 }).limit(limit);
};