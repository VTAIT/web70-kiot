import jwt from 'jsonwebtoken';
import { env } from './config.js';

const private_key = env.PRIVATEKEY;

// minus
const jwtSign = (data, time) => {
    return jwt.sign(data, private_key, { 'expiresIn': Math.floor(Date.now() / 1000) + (time * 60), "algorithm":"HS256" });
}

const jwtVerify = (data,) => {
    return jwt.verify(data, private_key);
}

export { jwtSign, jwtVerify };