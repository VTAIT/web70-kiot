import { hashPassWord, limit } from "../../globals/config.js";
import { MongoFields } from "../../globals/fields/mongo.js";
import { RegisterModel } from "../../globals/mongodb.js";

export const register_create = async (data) => {
    const { username,
        password,
        email,
        fullName,
        phone,
        address,
        gender
    } = data;

    const hashedPassword = await hashPassWord(password);

    const registerDoc = new RegisterModel({
        _id: 0,
        username,
        password: hashedPassword,
        email: email ? email : 'noemail@gmail.com',
        fullName,
        phone,
        address,
        role_id: 2,
        active: true,
        gender,
        status: 0
    });

    return await registerDoc.save();
};

export const registe_getAll = async (cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[MongoFields.id] = { $lte: cussor };
    }
    return await RegisterModel.find(query).sort({ [MongoFields.id]: -1 }).limit(limit).select("-password");
};

export const registe_getById = async (id) => {
    return await RegisterModel.findOne({ [MongoFields.id]: id });
};

export const registe_getOneByUserName = async (username) => {
    return await RegisterModel.findOne({ [MongoFields.username]: username }).select("-password");
};

export const registe_getByUserName = async (username) => {
    return await RegisterModel.find({ [MongoFieldsusername]: username }).select("-password");
};