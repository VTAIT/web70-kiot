import mongoose from "mongoose";
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

// const ModelAccount = mongoose.model('users', AccountSchema);

// const user = new ModelAccount({ fullName: 'abc', email: 'abc@gmail.com', username: 'abc', password: 'abc', role_id: 1 });
// try {
//     await user.validate();
//     console.log(user);
// } catch (err) {
//     console.log(err.message);
// }

export { AccountSchema };