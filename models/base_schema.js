import mongoose from "mongoose";

const BaseSchema = new mongoose.Schema(
    {
        // _id: {
        //     type: String, // can not get id when .find({})
        //     alias: "id",
        //     required: true,
        // },
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
