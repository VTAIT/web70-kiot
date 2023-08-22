import { KiotModel } from "../globals/mongodb.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let kiotFromDb = [];

    // supper admin
    if (role === 1) {
        kiotFromDb = await KiotModel.find({});
    } else {
        if (kiot_id) {
            kiotFromDb = await KiotModel.find({ kiot_id });
        }
    }

    res.send({
        data: kiotFromDb,
        message: "Thành công"
    });
};

export const getById = async (req, res) => {
    const { kiot_id, role } = req.users;
    const _id = req.query["Did"];

    let kiotFromDb = [];

    // supper admin
    if (role === 1) {
        kiotFromDb = await KiotModel.find({ _id });
    } else {
        if (kiot_id) {
            kiotFromDb = await KiotModel.find({ _id: kiot_id });
        }
    }

    res.send({
        data: kiotFromDb,
        message: "Thành công"
    });
};

export const createKiot = async (username) => {
    if (!username) throw new Error("Missing required fields");

    const kiotDoc = new KiotModel({
        username,
        email: "email@gmail.com",
        fullName: `${username}`,
        phone: 0,
        address: "",
        active: true
    });

    try {
        const susscess = await kiotDoc.save();
        return susscess;
    } catch (e) {
        throw new Error(e.messages);
    }
};

export const update = async (req, res) => {
    const { username, active, fullName, phone, email, address, describe } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    const existingKiot = await KiotModel.findOne({ username });

    if (!existingKiot) {
        return res.json({
            message: "Kiot not already exist",
        });
    }

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

    if (describe){
        existingKiot.describe = describe;
    }

    try {
        const susscess = await existingKiot.save();
        if (!susscess) {
            return res.send({ message: 'unsuccessful' });
        }
        
        res.send({
            data: susscess,
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
