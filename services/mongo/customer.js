import { limit } from "../../globals/config.js";
import { MongoFields } from "../../globals/fields/mongo.js";
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
        _id: 0,
        username,
        email: email ? email : 'noemail@gmail.com',
        fullName,
        phone,
        address,
        kiot_id,
        gender,
        transactionHistory: [],
        rank: 1,
        active: true
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
        rank,
        active
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

    if (active !== existingCustomer.active) {
        existingCustomer.active = active;
    }

    return await existingCustomer.save();
};

export const customer_getAll = async (cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[MongoFields.id] = { $lte: cussor };
    }
    return await CustomerModel.find(query).sort({ [MongoFields.id]: -1 }).limit(limit);
};

export const customer_getById = async (id) => {
    return await CustomerModel.findOne({ [MongoFields.id]: id });
};

export const customer_getByUserName = async (fullName, kiot_id) => {
    return await CustomerModel.findOne({ [MongoFields.fullName]: fullName, [MongoFields.kiot_id]: kiot_id });
};

export const customer_getAllByKiot = async (kiot_id, cussor = -1) => {
    let query = { [MongoFields.kiot_id]: kiot_id };

    if (cussor > 0) {
        query[MongoFields.id] = { $lte: cussor };
    }
    return await CustomerModel.find(query).sort({ [MongoFields.id]: -1 }).limit(50);
};