import mongoose from 'mongoose';
import { env } from './config.js'

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:${env.PORT_MONGODB}/${env.DBNAME}`);
        console.log(`Connect Successs: ${env.HOSTNAME}:${env.PORT_MONGODB}/${env.DBNAME}`)
    } catch (error) {
        console.log(error);
    }
}

const UserModel = mongoose.model('users', new mongoose.Schema({}, { strict: false, versionKey: false }));

export { connectDB, UserModel };