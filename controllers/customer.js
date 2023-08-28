import { RESPONSE } from "../globals/api.js";
import { Fields } from "../globals/fields.js";
import { customer_create, customer_getAll, customer_getAllByKiot, customer_getById, customer_getByUserName, customer_updateById } from "../services/mongo/customer.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let customerFromDb = [];
    try {
        // supper admin
        if (role === 1) {
            customerFromDb = await customer_getAll();
        } else {
            customerFromDb = await customer_getAllByKiot(kiot_id);
        }
        res.send(
            RESPONSE(
                {
                    [Fields.customerList]: customerFromDb
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

        const customerFromDb = await customer_getById(id);

        res.send(
            RESPONSE(
                {
                    [Fields.customerInfo]: customerFromDb
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
    const {
        email,
        fullName,
        phone,
        address,
        gender,
        kiot_id
    } = req.body;

    const { username } = req.users;
    try {
        if (!username
            || !fullName
            || !phone
            || !address
            || !gender
            || !kiot_id
        ) throw new Error("Missing required fields");

        if (await customer_getByUserName(fullName, kiot_id)) throw new Error("Customer has already exist");

        const customerDoc = await customer_create({
            email,
            fullName,
            phone,
            address,
            gender,
            username,
            kiot_id,
        });

        res.send(
            RESPONSE(
                {
                    [Fields.customerInfo]: customerDoc
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
    const {
        customerId,
        email,
        fullName,
        phone,
        address,
        gender,
        transaction,
        rank
    } = req.body;

    try {
        if (!customerId) throw new Error("Missing required fields");

        const result = await customer_updateById({
            customerId,
            email,
            fullName,
            phone,
            address,
            gender,
            transaction,
            rank
        });
        res.send(
            RESPONSE(
                {
                    [Fields.customerInfo]: result
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