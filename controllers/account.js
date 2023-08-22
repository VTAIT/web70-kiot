import { hashPassWord } from "../globals/config.js";
import { jwtSign } from "../globals/jwt.js";
import { RegisterModel, UserModel } from "../globals/mongodb.js";
import { createKiot } from './kiot.js'

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let accountFromDb = [];

    // supper admin
    if (role === 1) {
        accountFromDb = await UserModel.find({}).select("-password");
    } else {
        if (kiot_id) {
            accountFromDb = await UserModel.find({ kiot_id }).select("-password");
        }
    }

    res.send({
        data: accountFromDb,
        message: "Thành công"
    });
};

export const getById = async (req, res) => {
    const { kiot_id, role } = req.users;
    const _id = req.query["Did"];

    let accountFromDb = [];

    // supper admin
    if (role === 1) {
        accountFromDb = await UserModel.find({ _id }).select("-password");
    } else {
        if (kiot_id) {
            accountFromDb = await UserModel.find({ kiot_id, _id }).select("-password");
        }
    }

    res.send({
        data: accountFromDb,
        message: "Thành công"
    });
};

export const create = async (req, res) => {
    const { username, password, email, fullName, phone, address } = req.body;

    if (!username || !password || !fullName || !phone || !address) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }
    try {
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.json({
                message: "User has already exist",
            });
        }

        const kiotModel = await createKiot(username);
        if (!kiotModel) {
            return res.send({
                message: 'Kiot unsuccessful'
            });
        }

        const hashedPassword = await hashPassWord(password);

        const userDoc = new UserModel({
            username,
            password: hashedPassword,
            email,
            fullName,
            phone,
            address,
            status: 1,
            role_id: 2,
            active: true,
            kiot_id: kiotModel._id.toString()
        });


        const susscess = await userDoc.save();
        if (!susscess) {
            return res.send({ message: 'User unsuccessful' });
        }

        const jwtPayload = {
            id: susscess._id,
            username,
            role: susscess.role_id,
            kiot_id: susscess.kiot_id
        };

        const token = jwtSign(jwtPayload, 60);

        res.send({
            accessToken: token,
            message: "Create successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Create unsuccessful"
        });
    }
};

export const update = async (req, res) => {
    const { username, password, email, fullName, phone, address, active, gender, role_id, status } = req.body;

    if (!username) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
        return res.json({
            message: "User not already exist",
        });
    }

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

    if (role_id) {
        existingUser.role_id = role_id;
    }

    if (status) {
        existingUser.status = status;
    }

    try {
        const susscess = await existingUser.save();
        if (!susscess) {
            return res.send({ message: 'unsuccessful' });
        }

        const jwtPayload = {
            id: existingUser._id,
            username,
            role: existingUser.role_id,
            kiot_id: existingUser.kiot_id
        };

        const token = jwtSign(jwtPayload, 60);

        res.send({
            accessToken: token,
            message: "Update successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Update unsuccessful"
        });
    }
};

export const getAllAccept = async (req, res) => {
    try {
        const RegisterFromDb = await RegisterModel.find({ status: 0 });
        if (!RegisterFromDb) {
            return res.send({ messeger: 'Nothing' });
        }

        res.send({
            data: RegisterFromDb,
            message: "Thành công"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Không thành công"
        });
    }
};

export const acceptById = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.send({ message: 'Missing information' });
    }

    const AccountFromDb = await RegisterModel.findOne({ _id: id });

    if (!AccountFromDb) {
        return res.send({ message: 'Account does not exist' });
    }

    const userDoc = new UserModel({
        username: AccountFromDb.username,
        password: AccountFromDb.password,
        email: AccountFromDb.email,
        fullName: AccountFromDb.fullName,
        phone: AccountFromDb.phone,
        address: AccountFromDb.address,
        status: 1,
        active: true
    });

    AccountFromDb.status = 1;
    try {
        let susscess = await AccountFromDb.save();
        if (!susscess) {
            return res.send({ message: 'unsuccessful' });
        }

        susscess = await userDoc.save();
        if (!susscess) {
            return res.send({ message: 'unsuccessful' });
        }

        res.send({ message: "Kích hoạt thành công" });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Kích hoạt không thành công"
        });
    }
};