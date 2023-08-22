import BaseSchema from "./base_schema.js";

const ProductSchema = BaseSchema.clone();

ProductSchema.add({
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
    category: {
        type: Number,
        required: [true, 'category is required'],
    },
    code: {
        type: String,
    }
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