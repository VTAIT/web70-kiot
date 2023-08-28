import { KiotModel } from "../globals/mongodb.js";
import {
    kiot_getAll,
    kiot_getById,
    kiot_updateById,
} from "../services/mongo/kiot.js";

export const getAll = async (req, res) => {
    const { role } = req.users;

    let kiotFromDb = [];
    try {
        if (role === 1) {
            kiotFromDb = await kiot_getAll();

            res.json({
                data: kiotFromDb,
                message: "Successful",
            });
        }
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Unsuccessful",
            catch: e.message,
        });
    }
};

export const getById = async (req, res) => {
    const { kiot_id, role } = req.users;
    const id = req.query["Did"];

    let kiotFromDb = [];
    try {
        if (!id) throw new Error("Missing required fields");
        // supper admin
        if (role === 1) {
            kiotFromDb = await kiot_getById(id);
        } else {
            kiotFromDb = await kiot_getById(kiot_id);
        }

        res.send({
            data: kiotFromDb,
            message: "Successful",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Unsuccessful",
            catch: e.message,
        });
    }
};

export const update = async (req, res) => {
    const { active, fullName, phone, email, address, describe } = req.body;

    const { kiot_id } = req.users;
    try {
        if (!kiot_id) throw new Error("Missing required fields");

        const result = await kiot_updateById({
            active,
            fullName,
            phone,
            email,
            address,
            describe,
        });

        res.send({
            data: result,
            message: "Update successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Update unsuccessful",
            catch: e.message,
        });
    }
};
