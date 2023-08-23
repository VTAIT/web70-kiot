import { TransactionModel } from "../globals/mongodb.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let transactionFromDb = [];

    // supper admin
    if (role === 1) {
        transactionFromDb = await TransactionModel.find({});
    } else {
        if (kiot_id) {
            transactionFromDb = await TransactionModel.find({ kiot_id });
        }
    }

    res.send({
        data: transactionFromDb,
        message: "Thành công"
    });
};

export const getById = async (req, res) => {
    const { kiot_id, role } = req.users;
    const _id = req.query["Did"];

    let customerFromDb = [];

    // supper admin
    if (role === 1) {
        customerFromDb = await TransactionModel.find({ _id });
    } else {
        if (kiot_id) {
            customerFromDb = await TransactionModel.find({ kiot_id, _id });
        }
    }

    res.send({
        data: customerFromDb,
        message: "Thành công"
    });
};

export const create = async (req, res) => {
    const { username, kiot_id, status, deposit, returnV, retrun_list, product_list } = req.body;

    if (!username || !kiot_id || !status) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    if (status === 2 && (!retrun_list?.length || !returnV || returnV <= 0)) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    if (status === 3 && (!deposit || deposit <= 0)) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    if ([1, 3, 4].includes(status) && !product_list?.length) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    try {

        const codeV = Number(new Date().toISOString().split("T")[0].replaceAll("-", ""));

        const transactionDoc = new TransactionModel({
            username,
            kiot_id,
            status,
            deposit: status === 3 ? deposit : 0,
            returnV: status === 2 ? returnV : 0,
            retrun_list: status === 2 ? retrun_list : [],
            product_list: status !== 2 ? product_list : [],
            code: codeV
        });


        const susscess = await transactionDoc.save();
        if (!susscess) {
            return res.send({ message: 'Transaction unsuccessful' });
        }

        res.send({
            data: susscess,
            message: "Create successfully",
        });

    } catch (e) {
        // console.log('e', e)
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
    const { transactionId, status, deposit, returnV, retrun_list, product_list } = req.body;

    if (!transactionId) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    const existingTransaction = await TransactionModel.findOne({ _id: transactionId });

    if (!existingTransaction) {
        return res.json({
            message: "Transaction not already exist",
        });
    }

    // Giao dịch thành công không được sửa
    if (existingTransaction.status < 2) {
        return res.json({
            susscess: false,
            message: "Transaction was successful",
        });
    }

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

    try {
        const susscess = await existingTransaction.save();
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