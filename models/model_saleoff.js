import { SeqModel } from "../globals/mongodb.js";
import BaseSchema from "./base_schema.js";

const SaleOffSchema = BaseSchema.clone();

SaleOffSchema.add({
    kiot_id: {
        type: String,
        cast: '{VALUE} is invalid',
        required: [true, 'Kiot is required'],
    },
    name_product: {
        type: String,
        required: [true, 'Name is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    image: {
        type: String,
        cast: '{VALUE} is invalid',
    },
    user_id: {
        type: String,
        required: [true, 'User is required'],
    },
    type: {
        type: Number,
        required: [true, 'Type is required'],
    }
});

SaleOffSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const count = await SeqModel.increment('saleoffs');
    this._id = count;
});

export { SaleOffSchema };