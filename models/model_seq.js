import mongoose from "mongoose";

const SeqSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
},{
    timestamps: true,
    versionKey: false
});

// Add a static "increment" method to the Model
// It will recieve the collection name for which to increment and return the counter value
SeqSchema.static('increment', async function (seqName) {
    const count = await this.findByIdAndUpdate(
        seqName,
        { $inc: { seq: 1 } },
        // new: return the new value
        // upsert: create document if it doesn't exist
        { new: true, upsert: true }
    );
    return count.seq;
});

export { SeqSchema };