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

        res.send({
            data: customerFromDb,
            message: "Successful"
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
            catch: e.message
        });
    }
};

export const getById = async (req, res) => {
    const id = req.query["Did"];

    try {
        if (!id) throw new Error("Missing required fields");

        const customerFromDb = await customer_getById(id);

        res.send({
            data: customerFromDb,
            message: "Successful"
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
            catch: e.message
        });
    }
};

export const create = async (req, res) => {
    const {
        email,
        fullName,
        phone,
        address,
        gender
    } = req.body;

    const { kiot_id, username } = req.users;

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

        res.send({
            data: customerDoc,
            message: "Create successfully",
        });

    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Create unsuccessful",
            catch: e.message
        });
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
            catch: e.message
        });
    }
};