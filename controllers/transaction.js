import { RESPONSE } from "../globals/api.js";
import { ResponseFields } from "../globals/fields/response.js";
import { transaction_create, transaction_getAll, transaction_getAllByKiot, transaction_getAllByKiotReport, transaction_getById, transaction_updateById } from "../services/mongo/transaction.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;
    let cussor = req.query[ResponseFields.cussor];
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
                    [ResponseFields.transactionList]: transactionFromDb,
                    [ResponseFields.cussor]: transactionFromDb.slice(-1)[0]._id - 1
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
    const id = req.query[ResponseFields.did];

    try {
        if (!id) throw new Error("Missing required fields");

        const transactionFromDb = await transaction_getById(id);

        res.send(
            RESPONSE(
                {
                    [ResponseFields.transactiontInfo]: transactionFromDb
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
            product_list,
            value
        } = req.body;

        if (!username || !kiot_id || !status ) throw new Error("Missing required fields");

        if (status === 2 && (!retrun_list?.slice(-1)[0] || !returnV || returnV <= 0)) throw new Error("Missing required fields, status 2");

        if (status === 3 && (!deposit || deposit <= 0)) throw new Error("Missing required fields, status 3");

        if ([1, 3, 4].includes(status) && (!product_list?.slice(-1)[0] || !value || value <= 0)) throw new Error("Missing required fields, status 134");

        const transactionDoc = await transaction_create({
            username,
            kiot_id,
            status,
            deposit,
            returnV,
            retrun_list,
            product_list,
            value
        });

        res.send(
            RESPONSE(
                {
                    [ResponseFields.transactiontInfo]: transactionDoc
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
                    [ResponseFields.transactiontInfo]: result
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

export const getAllReport = async (req, res) => {
    const { kiot_id } = req.users;

    let transactionFromDb = [];

    try {
        transactionFromDb = await transaction_getAllByKiotReport(kiot_id);

        res.send(
            RESPONSE(
                {
                    [ResponseFields.transactionList]: transactionFromDb,
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