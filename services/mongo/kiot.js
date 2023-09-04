import { limit } from "../../globals/config.js";
import { MongoFields } from "../../globals/fields/mongo.js";
import { KiotModel } from "../../globals/mongodb.js";

export const kiot_create = async (username) => {
    if (!username) throw new Error("Missing required fields");

    const kiotDoc = new KiotModel({
        _id: 0,
        username,
        email: "noemail@gmail.com",
        fullName: `${username}`,
        phone: 0,
        address: "",
        active: true,
        describe: "",
    });

    return await kiotDoc.save();
};

export const kiot_updateById = async (data) => {
    const { kiot_id, active, fullName, phone, email, address, describe } = data;

    const existingKiot = await kiot_getById(kiot_id);

    if (!existingKiot) throw new Error("Kiot not already exist");

    if (email) {
        existingKiot.email = email;
    }

    if (fullName) {
        existingKiot.fullName = fullName;
    }

    if (phone) {
        existingKiot.phone = phone;
    }

    if (address) {
        existingKiot.address = address;
    }

    if (active != existingKiot.active) {
        existingKiot.active = active;
    }

    if (describe) {
        existingKiot.describe = describe;
    }

    return await existingKiot.save();
};

export const kiot_getAll = async (cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[MongoFields.id] = { $lte: cussor };
    }

    return await KiotModel.find(query)
        .sort({ [MongoFields.id]: -1 })
        .limit(limit);
};

export const kiot_getById = async (id) => {
    return await KiotModel.findOne({ [MongoFields.id]: id });
};

export const kiot_getByName = async (fullName) => {
    return await KiotModel.findOne({ [MongoFields.fullName]: fullName });
};
