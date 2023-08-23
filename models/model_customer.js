
import BaseSchemaInfo from "./base_info_schema.js";

const CustomerSchema = BaseSchemaInfo.clone();

CustomerSchema.add({
    kiot_id: {
        type: String,
        cast: '{VALUE} is invalid',
    },
    gender: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
    transactionHistory: {
        type: [String],
        cast: '{VALUE} is invalid',
    },
    rank: {
        type: Number,
        cast: '{VALUE} is invalid',
    },
});

export { CustomerSchema };