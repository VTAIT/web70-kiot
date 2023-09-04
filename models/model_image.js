import { SeqModel } from "../globals/mongodb.js";
import BaseSchema from "./base_schema.js";

const ImageSchema = BaseSchema.clone();

ImageSchema.add({
    kiot_id: {
        type: String,
        cast: "{VALUE} is invalid",
        required: [true, "Kiot is required"],
    },
    name_file: {
        type: String,
        cast: "{VALUE} is invalid",
        required: [true, "Name is required"],
    },
    src: {
        type: String,
        cast: "{VALUE} is invalid",
        required: [true, "src is required"],
    },
});

ImageSchema.pre("save", async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const count = await SeqModel.increment("images");
    this._id = count;
});

export { ImageSchema };
