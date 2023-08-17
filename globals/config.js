import 'dotenv/config';
import bcrypt from 'bcrypt';

const env = process.env;

const salt = await bcrypt.genSalt(Number(env.SALT));

const hashPassWord = async (password) => {
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const comparePassWord = async (password, hash) => {
    const result = await bcrypt.compare(password, hash);
    return result;
}

export { env, hashPassWord, comparePassWord };