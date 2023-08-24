import { KiotModel } from "../../globals/mongodb.js"

export const kiot_create = async (username) => {
    if (!username) throw new Error("Missing required fields");

    const kiotDoc = new KiotModel({
        username,
        email: "noemail@gmail.com",
        fullName: `${username}`,
        phone: 0,
        address: "",
        active: true,
        describe: ""
    });

    return await kiotDoc.save();
};

export const kiot_updateById = async (data) => {
    const {
        active,
        fullName,
        phone,
        email,
        address,
        describe
    } = data;

    const existingKiot = await customer_getById(customerId);

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

export const kiot_getAll = async () => {
    return await KiotModel.findOne({}).where('active', true);
};

export const kiot_getById = async (id) => {
    return await KiotModel.findOne({ _id: id });
};

export const kiot_getByName = async (fullName) => {
    return await KiotModel.findOne({ fullName });
};