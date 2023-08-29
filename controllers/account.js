import { hashPassWord } from "../globals/config.js";
import { user_create, user_getAll, user_getAllByKiot, user_getById, user_getByUserName, user_updateById } from "../services/mongo/user.js";
import { kiot_create } from "../services/mongo/kiot.js";
import { registe_getAll, registe_getById } from "../services/mongo/register.js";
import { RESPONSE } from "../globals/api.js";
import { Fields } from "../globals/fields.js";

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

        res.send(
            RESPONSE(
                {
                    [Fields.accountList]: accountFromDb
                },
                "Successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const getById = async (req, res) => {
    const id = req.query["Did"];

    try {
        if (!id) throw new Error("Missing required fields");

        const accountFromDb = await user_getById(id);

        res.send(
            RESPONSE(
                {
                    [Fields.userInfo]: accountFromDb
                },
                "Successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const create = async (req, res) => {
    try {
        const {
            username,
            password,
            email,
            fullName,
            phone,
            address,
            role_id
        } = req.body;

        const { kiot_id } = req.users;

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

        res.send(
            RESPONSE(
                {
                    [Fields.userInfo]: userDoc
                },
                "Create successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Create unsuccessful",
                e.errors,
                e.message
            )
        );
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

        res.send(
            RESPONSE(
                {
                    [Fields.userInfo]: result
                },
                "Update successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Update unsuccessful",
                e.errors,
                e.message
            )
        );
    }
};

export const getAllAccept = async (req, res) => {
    const { role } = req.users;
    try {
        if (role !== 1) throw new Error('Nothing');

        const RegisterFromDb = await registe_getAll();

        if (!RegisterFromDb || role !== 1) throw new Error('Nothing');

        res.send(
            RESPONSE(
                {
                    [Fields.accountList]: RegisterFromDb
                },
                "Successful",
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Unsuccessful",
                e.errors,
                e.message
            )
        );
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
        }, false);

        AccountFromDb.status = 1;
        await AccountFromDb.save();
        res.send(
            RESPONSE(
                {
                    [Fields.userInfo]: result
                },
                "Active successfully",
            )
        );

    } catch (e) {
        res.status(400).send(
            RESPONSE(
                [],
                "Active unsuccessful",
                e.errors,
                e.message
            )
        );
    }

};