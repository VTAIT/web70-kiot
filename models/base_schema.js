import mongoose from "mongoose";

const BaseSchema = new mongoose.Schema({
    active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
    versionKey: false
});

// const BaseModel = mongoose.model('users', BaseSchema);
// const user = new BaseModel();
// console.log(user);

export default BaseSchema;