import mongoose from "mongoose";

const BaseSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
            alias: "id",
            required: true,
        },
        active: {
            type: Boolean,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default BaseSchema;
