import { CustomerModel } from "../../globals/mongodb.js";

export const customer_create = async (data) => {
    const {
        email,
        fullName,
        phone,
        address,
        gender,
        kiot_id,
        username,
    } = data;

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

    return await customerDoc.save();
};

export const customer_updateById = async (data) => {
    const {
        customerId,
        email,
        fullName,
        phone,
        address,
        gender,
        transaction,
        rank
    } = data;

    const existingCustomer = await customer_getById(customerId);

    if (!existingCustomer) throw new Error("Customer not already exist");

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

    if (transaction) {
        existingCustomer.transactionHistory.push(transactionHistory);
    }

    return await existingCustomer.save();
};

export const customer_getAll = async () => {
    return await CustomerModel.findOne({}).where('active', true);
};

export const customer_getById = async (id) => {
    return await CustomerModel.findOne({ _id: id });
};

export const customer_getByUserName = async (username, kiot_id) => {
    return await CustomerModel.findOne({ username, kiot_id });
};

export const customer_getAllByKiot = async (kiot_id) => {
    return await CustomerModel.find({ kiot_id });
};