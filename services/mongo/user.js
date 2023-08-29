import { hashPassWord, limit } from "../../globals/config.js";
import { Fields } from "../../globals/fields.js";
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
        password: isHashPassword ? await hashPassWord(password) : password,
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

    const existingUser = await user_getById(userId, true);

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

export const user_getByUserName = async (username, isShowPassword = false) => {
    if (isShowPassword) return await UserModel.findOne({ username: username });
    return await UserModel.findOne({ username: username }).select("-password");;
};

export const user_getById = async (id, isShowPassword = false) => {
    if (isShowPassword) return await UserModel.findOne({ _id: id })
    return await UserModel.findOne({ _id: id }).select("-password");
};

export const user_getAll = async (isShowPassword = false, cussor = -1) => {
    let query = {};

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }

    if (isShowPassword) return await UserModel.find(query).sort({ [Fields.id]: -1 }).limit(limit);
    return await UserModel.find(query).sort({ [Fields.id]: -1 }).limit(limit).select("-password");
};

export const user_getAllByKiot = async (kiotId, isShowPassword = false, cussor = -1) => {
    let query = { kiotId: kiotId };

    if (cussor > 0) {
        query[Fields.id] = { $lte: cussor };
    }

    if (isShowPassword) return awaitUserModel.find(query).sort({ [Fields.id]: -1 }).limit(limit);
    return await UserModel.find(query).sort({ [Fields.id]: -1 }).limit(limit).select("-password");
};