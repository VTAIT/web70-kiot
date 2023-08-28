import { SeqModel } from "../globals/mongodb.js";
import BaseSchemaInfo from "./base_info_schema.js";

const AccountSchema = BaseSchemaInfo.clone();

AccountSchema.add({
    kiot_id: {
        type: String,
        cast: '{VALUE} is invalid',
    },
    gender: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
    },
    role_id: {
        type: Number,
        cast: '{VALUE} is invalid'
    },
    // trạng thái yêu cầu duyệt từ người dùng
    status: {
        type: Number,
        cast: '{VALUE} is invalid',
    }
});

AccountSchema.pre('save', async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;

    const count = await SeqModel.increment('users');
    this._id = count;
});

export { AccountSchema };