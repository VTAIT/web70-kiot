import { hashPassWord } from "../../globals/config.js";
import { RegisterModel } from "../../globals/mongodb.js";

export const register_create = async (data) => {
    const { username,
        password,
        email,
        fullName,
        phone,
        address,
        gender
    } = data;

    const hashedPassword = await hashPassWord(password);

    const registerDoc = new RegisterModel({
        username,
        password: hashedPassword,
        email: email ? email : 'noemail@gmail.com',
        fullName,
        phone,
        address,
        role_id: 2,
        active: true,
        gender
    });

    return await registerDoc.save();
};

export const registe_getAll = async () => {
    return await RegisterModel.findOne({}).where('status', 0);
};

export const registe_getById = async (id) => {
    return await RegisterModel.findOne({ _id: id });
};

export const registe_getByUserName = async (username) => {
    return await RegisterModel.findOne({ username });
};