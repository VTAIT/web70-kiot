import { SeqModel } from "../globals/mongodb.js";
import BaseSchemaInfo from "./base_info_schema.js";

const TransactionSchema = BaseSchemaInfo.clone();

TransactionSchema.add({
    kiot_id: {
        type: String,
        cast: '{VALUE} is invalid',
    },
    status: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
    // Tiền đặt cọc
    deposit: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
    // Tiền trả hàng
    returnV: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
    // Danh sách hàng trả
    retrun_list: {
        type: [{
            _id: false,
            name: {
                type: String,
                cast: '{VALUE} is invalid',
                required: [true, 'Name is required']
            },
            value: {
                type: Number,
                cast: '{VALUE} is invalid',
                required: [true, 'Value is required']
            },
        }],
        cast: '{VALUE} is invalid',
    },
    // Danh sách hàng mua
    product_list: {
        type: [{
            _id: false,
            name: {
                type: String,
                cast: '{VALUE} is invalid',
                required: [true, 'Name is required']
            },
            value: {
                type: Number,
                cast: '{VALUE} is invalid',
                required: [true, 'Value is required']
            }
        }],
        cast: '{VALUE} is invalid',

    },
    // Sử dụng để thông kê
    code: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
    // Tổng tiền
    value: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
});
TransactionSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const count = await SeqModel.increment('transactions');
    this._id = count;
});

export { TransactionSchema };