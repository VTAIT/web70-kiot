
import BaseSchemaInfo from "./base_info_schema.js";

const KiotSchema = BaseSchemaInfo.clone();

KiotSchema.add({
    describe: String,
    image: String
});

export { KiotSchema };