import { hashPassWord } from "../globals/config.js";
import { user_create, user_getAll, user_getAllByKiot, user_getById, user_getByUserName, user_updateById } from "../services/mongo/user.js";
import { kiot_create } from "../services/mongo/kiot.js";
import { registe_getAll, registe_getById } from "../services/mongo/register.js";

export const getAll = async (req, res) => {
    const { kiot_id, role } = req.users;

    let accountFromDb = [];
    try {
        // supper admin
        if (role === 1) {
            accountFromDb = await user_getAll(role);
        } else {
            accountFromDb = await user_getAllByKiot({ kiot_id });
        }

        res.send({
            data: accountFromDb,
            message: "Successful"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Unsuccessful",
            catch: e.message
        });
    }
};

export const getById = async (req, res) => {
    const id = req.query["Did"];

    try {
        if (!id) throw new Error("Missing required fields");

        const accountFromDb = await user_getById(id);

        res.send({
            data: accountFromDb,
            message: "Thành công"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Unsuccessful",
            catch: e.message
        });
    }
};

export const create = async (req, res) => {
    const { username, password, email, fullName, phone, address, role_id } = req.body;
    const { kiot_id } = req.users;
    try {
        if (!username
            || !password
            || !fullName
            || !phone
            || !address
        ) throw new Error("Missing required fields");

        if (await user_getByUserName(username)) throw new Error("User has already exist");

        const hashedPassword = await hashPassWord(password);

        const userDoc = await user_create({
            username,
            password: hashedPassword,
            email,
            fullName,
            phone,
            address,
            status: 1,
            role_id: role_id ? role_id : 3,
            active: true,
            kiot_id
        });

        res.send({
            data: userDoc,
            message: "Create successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Create unsuccessful",
            catch: e.message
        });
    }
};

export const update = async (req, res) => {
    const { userId, password, email, fullName, phone, address, active, gender, role_id, status } = req.body;
    try {
        if (!userId) throw new Error("Missing required fields");

        const result = await user_updateById({
            userId,
            password,
            email,
            fullName,
            phone,
            address,
            active,
            gender,
            role_id: userId === req.users.id ? req.users.role : role_id,
            status
        });

        res.send({
            data: result,
            message: "Update successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).send({
            error: messages,
            message: "Update unsuccessful",
            catch: e.message
        });
    }
};

export const getAllAccept = async (req, res) => {
    const { role } = req.users;
    try {
        if (role !== 1) throw new Error('Nothing');

        const RegisterFromDb = await registe_getAll();

        if (!RegisterFromDb || role !== 1) throw new Error('Nothing');

        res.send({
            data: RegisterFromDb,
            message: "Successful"
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Unsuccessful",
            catch: e.message
        });
    }
};

export const acceptById = async (req, res) => {
    const { id } = req.body;

    try {
        if (!id) throw new Error('Missing information');

        const AccountFromDb = await registe_getById(id);

        if (!AccountFromDb) throw new Error('Account does not exist');

        const { username,
            password,
            email,
            fullName,
            phone,
            address
        } = AccountFromDb;

        const existingUser = await user_getByUserName(username);

        if (existingUser) throw new Error("User has already exist");

        const kiotModel = await kiot_create(username);

        const result = await user_create({
            username,
            password,
            email,
            fullName,
            phone,
            address,
            role_id: 2,
            kiot_id: kiotModel._id.toString()
        });

        AccountFromDb.status = 1;
        await AccountFromDb.save();

        res.send({
            data: result,
            message: "Active successfully",
        });

    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({
            error: messages,
            message: "Active unsuccessful",
            catch: e.message
        });
    }

};