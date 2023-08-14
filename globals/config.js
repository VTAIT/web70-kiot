import 'dotenv/config';
import bcrypt from 'bcrypt';

const env = process.env;

const salt = await bcrypt.genSalt(Number(env.SALT));

const hashPassWord = async (password) => {
    console.log(password, salt)
    try {
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        return error;
    }
}

const comparePassWord = async (password, hash) => {
    const result = await bcrypt.compare(password, hash);
    console.log(result, password, hash)
    return result;
}

export { env, hashPassWord, comparePassWord };