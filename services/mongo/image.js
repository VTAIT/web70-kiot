import { limit } from "../../globals/config.js";
import { MongoFields } from "../../globals/fields/mongo.js";
import { ImageModel } from "../../globals/mongodb.js";

export const image_create = async (data) => {
    const { kiot_id, name_file, src } = data;

    const imageDoc = new ImageModel({
        _id: 0,
        kiot_id,
        name_file,
        src,
        active: true,
    });

    return await imageDoc.save();
};

export const image_updateById = async (data) => {
    const { imageId, name_file, active } = data;

    const existingImage = await image_getById(imageId);

    if (!existingImage) throw new Error("Image not already exist");
    if (name_file === existingImage.name_file)
        throw new Error("Image has already exist");

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
        query[MongoFields.id] = { $lte: cussor };
    }

    return await ImageModel.find(query)
        .sort({ [MongoFields.id]: -1 })
        .limit(limit);
};

export const image_getById = async (id) => {
    return await ImageModel.findOne({ [MongoFields.id]: id });
};

export const image_getByName = async (name_product, kiot_id) => {
    return await ImageModel.findOne({
        [MongoFields.name_product]: name_product,
        [MongoFields.kiot_id]: kiot_id,
    });
};

export const image_getAllByKiot = async (kiot_id, cussor = -1) => {
    let query = { [MongoFields.kiot_id]: kiot_id };

    if (cussor > 0) {
        query[MongoFields.id] = { $lte: cussor };
    }

    return await ImageModel.find(query)
        .sort({ [Fields.id]: -1 })
        .limit(limit);
};
