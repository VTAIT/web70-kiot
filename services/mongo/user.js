import { hashPassWord } from "../../globals/config.js";
import { UserModel } from "../../globals/mongodb.js";

export const user_create = async (data, isHashPassword = true) => {
    const { username,
        password,
        email,
        fullName,
        phone,
        address,
        role_id,
        kiot_id
    } = data;

    const userDoc = new UserModel({
        _id: 0,
        username,
        password: isHashPassword ? await hashPassWord(password): password,
        email: email ? email : 'noemail@gmail.com',
        fullName,
        phone,
        address,
        role_id: role_id ? role_id : 3,
        active: true,
        kiot_id
    });

    const result = await userDoc.save();
    return result;

};

export const user_updateById = async (data) => {
    const { userId,
        password,
        email,
        fullName,
        phone,
        address,
        active,
        gender,
        role_id,
        status
    } = data;

    const existingUser = await user_getById(userId);

    if (!existingUser) throw new Error("User not already exist");

    if (password) {
        const hashedPassword = await hashPassWord(password);
        existingUser.password = hashedPassword;
    }

    if (email) {
        existingUser.email = email;
    }

    if (fullName) {
        existingUser.fullName = fullName;
    }

    if (phone) {
        existingUser.phone = phone;
    }

    if (address) {
        existingUser.address = address;
    }

    if (active != existingUser.active) {
        existingUser.active = active;
    }

    if (gender) {
        existingUser.gender = gender;
    }

    if (role_id > 1) {
        existingUser.role_id = role_id;
    }

    if (status) {
        existingUser.status = status;
    }

    return await existingUser.save();
};

export const user_getByUserName = async (username, isAdmin = false) => {
    if (isAdmin) {
        return await UserModel.findOne({ username: username });
    }
    return await UserModel.findOne({ username: username });
};

export const user_getById = async (id, isAdmin = false) => {
    if (isAdmin) return await UserModel.findOne({ _id: id });
    return await UserModel.findOne({ _id: id });
};

export const user_getAll = async (isAdmin = false) => {
    if (isAdmin) return await UserModel.find({});
    return await UserModel.find({});
};

export const user_getAllByKiot = async (kiotId, isAdmin = false) => {
    if (isAdmin) return await UserModel.find({ kiotId: kiotId });
    return await UserModel.find({ kiotId: kiotId });
};