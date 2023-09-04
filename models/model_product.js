import { SeqModel } from "../globals/mongodb.js";
import BaseSchema from "./base_schema.js";

const ProductSchema = BaseSchema.clone();

ProductSchema.add({
    kiot_id: {
        type: String,
        cast: "{VALUE} is invalid",
        required: [true, "Kiot is required"],
    },
    user_id: {
        type: String,
        required: [true, "User is required"],
    },
    product_code: {
        type: String,
    },
    name_product: {
        type: String,
        required: [true, "Name is required"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    image: {
        type: String,
        cast: "{VALUE} is invalid",
    },
    category: {
        type: String,
        required: [true, "category is required"],
    },
    description: {
        type: String,
        required: [true, "decription is required"],
    },
    code: {
        type: String,
        default: "",
    },
    customer_rate: {
        type: Number,
        default: 5,
    },
});

ProductSchema.pre("save", async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const count = await SeqModel.increment("products");
    this._id = count;
});

export { ProductSchema };
