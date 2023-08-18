import mongoose from "mongoose";
import BaseSchema from "./base_schema.js";

const validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const BaseSchemaInfo = BaseSchema.clone();
BaseSchemaInfo.add({
    fullName: {
        type: String,
    },
    username: {
        type: String,
        trim: true,
        required: [true, 'User Name is required'],
        validate: {
            validator: (v) => {
                return /^[a-z 0-9]/.test(v);
            },
            message: "User Name only lowercase"
        }
    },
    phone: {
        type: Number,
        validate: {
            validator: (v) => {
                return /^[0-9]/.test(v);
            },
            message: "Phone only number"
        }
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email address is required'],
        validate: {
            validator: (v) => {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    address: {
        type: String,
    },
});


// const BaseSchemaInfoModel = mongoose.model('users', BaseSchemaInfo);

// const user = new BaseSchemaInfoModel({ fullName: 'abc', email: 'abcmail.com' });
// try {
//     await user.validate();
//     console.log(user);
// } catch (err) {
//     console.log(err.message);
// }


export default BaseSchemaInfo;