import mongoose from 'mongoose';
import { env } from './config.js'
import { AccountSchema } from '../models/model_account.js';

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:${env.PORT_MONGODB}/${env.DBNAME}`);
        console.log(`Connect Successs: ${env.HOSTNAME}:${env.PORT_MONGODB}/${env.DBNAME}`)
    } catch (error) {
        console.log(error);
    }
}

const UserModel = mongoose.model('users', AccountSchema);

export { connectDB, UserModel };