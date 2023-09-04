import { RESPONSE } from "../globals/api.js";
import { ResponseFields } from "../globals/fields/response.js";
import {
    kiot_getAll,
    kiot_getById,
    kiot_updateById,
} from "../services/mongo/kiot.js";

export const getAll = async (req, res) => {
    const { role } = req.users;
    let cussor = req.query[ResponseFields.cussor];
    if (!Number(cussor)) cussor = -1;

    let kiotFromDb = [];

    try {
        if (role !== 1) throw new Error("You not right");

        kiotFromDb = await kiot_getAll(cussor);

        return res.send(
            RESPONSE(
                {
                    [ResponseFields.kiotList]: kiotFromDb,
                    [ResponseFields.cussor]: kiotFromDb.slice(-1)[0]._id - 1,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const getById = async (req, res) => {
    const { kiot_id, role } = req.users;
    const id = req.query[ResponseFields.did];

    let kiotFromDb = [];
    try {
        if (!id) throw new Error("Missing required fields");
        // supper admin
        if (role === 1) {
            kiotFromDb = await kiot_getById(id);
        } else {
            kiotFromDb = await kiot_getById(kiot_id);
        }
        res.send(
            RESPONSE(
                {
                    [ResponseFields.kiotInfo]: kiotFromDb,
                },
                "Successful"
            )
        );
    } catch (e) {
        res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};

export const update = async (req, res) => {
    const { kiot_id, active, fullName, phone, email, address, describe } =
        req.body;

    try {
        if (!kiot_id) throw new Error("Missing required fields");

        const result = await kiot_updateById({
            kiot_id,
            active: Boolean(active),
            fullName,
            phone,
            email,
            address,
            describe,
        });
        res.send(
            RESPONSE(
                {
                    [ResponseFields.kiotInfo]: result,
                },
                "Update successful"
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE([], "Update unsuccessful", e.errors, e.message)
        );
    }
};