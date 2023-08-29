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
        imageId,
        name_file,
        active
    } = data;

    const existingImage = await image_getById(imageId);

    if (!existingImage) throw new Error("Image not already exist");
    if (name_file === existingImage.name_file) throw new Error("Image has already exist");

    if (name_file) {
        existingImage.name_file = name_file;
    }

    if (active != existingImage.active) {
        existingImage.active = active;
    }

    return await existingImage.save();
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