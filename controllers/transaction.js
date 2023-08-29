import { RESPONSE } from "../globals/api.js";
import { limit } from "../globals/config.js";
import { Fields } from "../globals/fields.js";
import { transaction_create, transaction_getAll, transaction_getAllByKiot, transaction_getById, transaction_updateById } from "../services/mongo/transaction.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;
    let cussor = req.query[Fields.cussor];
    if (!Number(cussor)) cussor = -1;

    let transactionFromDb = [];

    try {
        // supper admin
        if (role === 1) {
            transactionFromDb = await transaction_getAll(cussor);
        } else {
            transactionFromDb = await transaction_getAllByKiot(kiot_id, cussor);
        }
        res.send(
            RESPONSE(
                {
                    [Fields.transactionList]: transactionFromDb,
                    [Fields.cussor]: transactionFromDb[limit - 1]._id - 1
                },
                "Successful",
            )
        );

    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const getById = async (req, res) => {
    const id = req.query["Did"];

    try {
        if (!id) throw new Error("Missing required fields");

        const transactionFromDb = await transaction_getById(id);

        res.send(
            RESPONSE(
                {
                    [Fields.transactiontInfo]: transactionFromDb
                },
                "Successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const create = async (req, res) => {
    try {
        const {
            username,
            kiot_id,
            status,
            deposit,
            returnV,
            retrun_list,
            product_list
        } = req.body;

        if (!username || !kiot_id || !status) throw new Error("Missing required fields");

        if (status === 2 && (!retrun_list?.length || !returnV || returnV <= 0)) throw new Error("Missing required fields, status 2");

        if (status === 3 && (!deposit || deposit <= 0)) throw new Error("Missing required fields, status 3");

        if ([1, 3, 4].includes(status) && !product_list?.length) throw new Error("Missing required fields, status 134");

        const transactionDoc = await transaction_create({
            username,
            kiot_id,
            status,
            deposit,
            returnV,
            retrun_list,
            product_list
        });

        res.send(
            RESPONSE(
                {
                    [Fields.transactiontInfo]: transactionDoc
                },
                "Create successful",
            )
        );

    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Create unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const update = async (req, res) => {
    try {
        const {
            transactionId,
            status,
            deposit,
            returnV,
            retrun_list,
            product_list
        } = req.body;

        if (!transactionId) throw new Error("Missing required fields");

        const result = await transaction_updateById({
            transactionId,
            status,
            deposit,
            returnV,
            retrun_list,
            product_list
        });

        res.send(
            RESPONSE(
                {
                    [Fields.transactiontInfo]: result
                },
                "Update successful",
            )
        );

    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Update unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};