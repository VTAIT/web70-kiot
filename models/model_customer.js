
import { SeqModel } from "../globals/mongodb.js";
import BaseSchemaInfo from "./base_info_schema.js";

const CustomerSchema = BaseSchemaInfo.clone();

CustomerSchema.add({
    kiot_id: {
        type: String,
        cast: '{VALUE} is invalid',
    },
    gender: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
    transactionHistory: {
        type: [String],
        cast: '{VALUE} is invalid',
    },
    rank: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
});

CustomerSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const count = await SeqModel.increment('customers');
    this._id = count;
});

export { CustomerSchema };