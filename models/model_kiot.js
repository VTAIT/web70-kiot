
import { SeqModel } from "../globals/mongodb.js";
import BaseSchemaInfo from "./base_info_schema.js";

const KiotSchema = BaseSchemaInfo.clone();

KiotSchema.add({
    describe: String,
    image: String
});

KiotSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const count = await SeqModel.increment('kiots');
    this._id = count;
});

export { KiotSchema };