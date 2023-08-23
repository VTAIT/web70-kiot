import { CustomerModel } from "../globals/mongodb.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let customerFromDb = [];

    // supper admin
    if (role === 1) {
        customerFromDb = await CustomerModel.find({});
    } else {
        if (kiot_id) {
            customerFromDb = await CustomerModel.find({ kiot_id });
        }
    }

    res.send({
        data: customerFromDb,
        message: "Thành công"
    });
};

export const getById = async (req, res) => {
    const { kiot_id, role } = req.users;
    const _id = req.query["Did"];

    let customerFromDb = [];

    // supper admin
    if (role === 1) {
        customerFromDb = await CustomerModel.find({ _id });
    } else {
        if (kiot_id) {
            customerFromDb = await CustomerModel.find({ kiot_id, _id });
        }
    }

    res.send({
        data: customerFromDb,
        message: "Thành công"
    });
};

export const create = async (req, res) => {
    const { username, email, fullName, phone, address, gender, kiot_id } = req.body;

    if (!username || !fullName || !phone || !address || !gender || !kiot_id) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    try {
        const existingCustomer = await CustomerModel.findOne({ fullName });

        if (existingCustomer) {
            return res.json({
                message: "Customer has already exist",
            });
        }

        const customerDoc = new CustomerModel({
            username,
            email,
            fullName,
            phone,
            address,
            kiot_id,
            gender,
            transactionHistory: [],
            rank: 1
        });


        const susscess = await customerDoc.save();
        if (!susscess) {
            return res.send({ message: 'Customer unsuccessful' });
        }

        res.send({
            data: susscess,
            message: "Create successfully",
        });

    } catch (e) {
        // console.log('e',e)
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Create unsuccessful"
        });
    }
};

export const update = async (req, res) => {
    const { customerId, email, fullName, phone, address, gender, transactionHistory, rank } = req.body;

    if (!customerId) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    const existingCustomer = await CustomerModel.findOne({ _id: customerId });

    if (!existingCustomer) {
        return res.json({
            message: "Customer not already exist",
        });
    }

    if (email) {
        existingCustomer.email = email;
    }

    if (fullName) {
        existingCustomer.fullName = fullName;
    }

    if (phone) {
        existingCustomer.phone = phone;
    }

    if (address) {
        existingCustomer.address = address;
    }

    if (gender) {
        existingCustomer.gender = gender;
    }

    if (rank) {
        existingCustomer.rank = rank;
    }

    if (transactionHistory) {
        existingCustomer.transactionHistory.push(transactionHistory);
    }

    try {
        const susscess = await existingCustomer.save();
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