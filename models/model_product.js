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
    product_name: {
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
    promotion: {
        type: Boolean,
        default: false,
    },
    promotion_rate: {
        type: Number,
        default: 0,
    },
    customer_rate: {
        type: Number,
        default: 5,
    },
});

// const ModelProduct = mongoose.model('products', ProductSchema);

// const user = new ModelProduct({ fullName: 'abc', email: 'abc@gmail.com', username: 'abc', password: 'abc', role_id: 1 });
// try {
//     await user.validate();
//     console.log(user);
// } catch (err) {
//     console.log(err.message);
// }

export { ProductSchema };
