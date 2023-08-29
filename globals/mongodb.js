import mongoose from "mongoose";
import { env } from "./config.js";
import { AccountSchema } from "../models/model_account.js";
import { ProductSchema } from '../models/model_product.js';
import { KiotSchema } from '../models/model_kiot.js';
import { CustomerSchema } from "../models/model_customer.js";
import { TransactionSchema } from "../models/model_transaction.js";
import { SaleOffSchema } from "../models/model_saleoff.js";
import { SeqSchema } from "../models/model_seq.js";
import { RegisterSchema } from "../models/model_register.js";
import { ImageSchema } from "../models/model_image.js";

const connectDB = async () => {
  try {
    // await mongoose.connect(`mongodb://127.0.0.1:${env.PORT_MONGODB}/${env.DBNAME}`);
    // console.log(`Connect Successs: ${env.HOSTNAME}:${env.PORT_MONGODB}/${env.DBNAME}`)
    const connection = await mongoose.connect(env.MONGO_URI);
    console.log(`Connect to database at ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

const UserModel = mongoose.model("users", AccountSchema);
const ProductModel = mongoose.model('products', ProductSchema);
const RegisterModel = mongoose.model('registers', RegisterSchema);
const KiotModel = mongoose.model('kiots', KiotSchema);
const CustomerModel = mongoose.model('customers', CustomerSchema);
const TransactionModel = mongoose.model('transactions', TransactionSchema);
const SaleOffModel = mongoose.model('saleoffs', SaleOffSchema);
const ImageModel = mongoose.model('images', ImageSchema);
const SeqModel = mongoose.model('seqs', SeqSchema);

export { connectDB, UserModel, ProductModel, RegisterModel, KiotModel, CustomerModel, TransactionModel, SaleOffModel, ImageModel, SeqModel };
