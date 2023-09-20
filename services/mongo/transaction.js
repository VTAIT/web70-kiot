import { limit } from "../../globals/config.js";
import { MongoFields } from "../../globals/fields/mongo.js";
import { TransactionModel } from "../../globals/mongodb.js";

export const transaction_create = async (data) => {
    const {
        username,
        kiot_id,
        status,
        deposit,
        returnV,
        retrun_list,
        product_list,
        value
    } = data;

    
    const dateCurrent = new Date().toISOString();
    const splitDate = dateCurrent.split("T")[0];
    const replaceDate = splitDate.replace(/-/g, '');

    const codeV = Number(replaceDate);

    const transactionDoc = new TransactionModel({
        _id: 0,
        username,
        kiot_id,
        status,
        deposit: status === 3 ? deposit : 0,
        returnV: status === 2 ? returnV : 0,
        retrun_list: status === 2 ? retrun_list : [],
        product_list: status !== 2 ? product_list : [],
        code: codeV,
        value
    });

    return await transactionDoc.save();
};

export const transaction_updateById = async (data) => {
    const {
        transactionId,
        status,
        deposit,
        returnV,
        retrun_list,
        product_list
    } = data;

    const existingTransaction = await transaction_getById(transactionId);

    if (!existingTransaction) throw new Error("Transaction not already exist");

    // Giao dịch thành công không được sửa
    if (existingTransaction.status < 2) throw new Error("Transaction was successful");

    if (status) {
        existingTransaction.status = status;
    }

    if (deposit) {
        existingTransaction.deposit = deposit;
    }

    if (returnV) {
        existingTransaction.returnV = returnV;
    }

    if (retrun_list) {
        existingTransaction.retrun_list = retrun_list;
    }

    if (product_list) {
        existingTransaction.product_list = product_list;
    }

    return await existingTransaction.save();
};

export const transaction_getAll = async (cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[MongoFields.id] = { $lte: cussor };
    }

    return await TransactionModel.find(query).sort({ [MongoFields.id]: -1 }).limit(limit);;
};

export const transaction_getById = async (id) => {
    return await TransactionModel.findOne({ [MongoFields.id]: id });
};

export const transaction_getByName = async (name_product, kiot_id) => {
    return await TransactionModel.findOne({ [MongoFields.name_product]: name_product, [MongoFields.kiot_id]: kiot_id });
};

export const transaction_getAllByKiot = async (kiot_id, cussor = -1) => {
    let query = { [MongoFields.kiot_id]: kiot_id };

    if (cussor > 0) {
        query[MongoFields.id] = { $lte: cussor };
    }
    return await TransactionModel.find(query).sort({ [MongoFields.id]: -1 }).limit(limit);
};

export const transaction_getAllByKiotReport = async (kiot_id) => {
    let query = { [MongoFields.kiot_id]: kiot_id };
    return await TransactionModel.find(query).sort({ [MongoFields.id]: -1 });
};
