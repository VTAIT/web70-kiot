import { limit } from "../../globals/config.js";
import { Fields } from "../../globals/fields.js";
import { SaleOffModel } from "../../globals/mongodb.js";

export const saleoff_create = async (data) => {
    const {
        kiot_id,
        name_product,
        price,
        image,
        type,
        id
    } = data;

    const saleOffDoc = new SaleOffModel({
        _id: 0,
        kiot_id,
        name_product,
        price,
        image: image ? image : "",
        user_id: id,
        code: "",
        type,
        active: true
    });

    return await saleOffDoc.save();
};

export const saleoff_updateById = async (data) => {
    const {
        saleOffId,
        name_product,
        price,
        image,
        type,
        active
    } = data;

    const existingSaleOff = await saleoff_getById(saleOffId);

    if (!existingSaleOff) throw new Error("Sale Off not already exist");

    if (name_product === existingSaleOff.name_product) throw new Error("Sale Off has already exist");

    if (name_product) {
        existingSaleOff.name_product = name_product;
    }

    if (price) {
        existingSaleOff.price = price;
    }

    if (image) {
        existingSaleOff.image = image;
    }

    if (active != existingSaleOff.active) {
        existingSaleOff.active = active;
    }

    if (type) {
        existingSaleOff.type = type;
    }

    return await existingSaleOff.save();
};

export const saleoff_getAll = async (cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }
    return await SaleOffModel.find(query).sort({ [Fields.id]: -1 }).limit(limit);
};

export const saleoff_getById = async (id) => {
    return await SaleOffModel.findOne({ _id: id });
};

export const saleoff_getByName = async (name_product, kiot_id) => {
    return await SaleOffModel.findOne({ name_product: name_product, kiot_id: kiot_id });
};

export const saleoff_getAllByKiot = async (kiot_id, cussor = -1) => {
    let query = { kiot_id: kiot_id };

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }
    return await SaleOffModel.find(query).sort({ [Fields.id]: -1 }).limit(limit);
};

export const saleoff_getByArray = async (array) => {
    let query = {};
    if (array.length) {
        query[Fields.name_product] = { $in: array };
        query[Fields.type] = 1
    }
    return await SaleOffModel.find(query);
};

export const saleoff_getByTracsaction = async (kiot_id) => {
    let query = {
        kiot_id: kiot_id,
        [Fields.type]: 2
    };
    return await SaleOffModel.find(query).sort({ [Fields.id]: -1 });
};
