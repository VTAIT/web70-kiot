import { comparePassWord } from "../globals/config.js";
import { jwtSign } from "../globals/jwt.js";
import { user_getById, user_getByUserName } from "../services/mongo/user.js";
import {
    registe_getOneByUserName,
    register_create,
} from "../services/mongo/register.js";
import { ResponseFields } from "../globals/fields/response.js";
import { RESPONSE } from "../globals/api.js";
import { MongoFields } from "../globals/fields/mongo.js";

export const loginController = async (req, res) => {
    const { username, password } = req.body;

    try {
        //   1. Validation
        if (!username || !password) throw new Error("Missing required fields");

        //   2. Check authentication
        const existingUser = await user_getByUserName(username, true);

        if (!existingUser) throw new Error("Invalid credentials!");

        // 3. Check password
        const isMatchPassword = await comparePassWord(
            password,
            existingUser.password
        );
        if (!isMatchPassword)
            throw new Error("Username or password is not correct!");

        // Create JWT Token & Response to client
        const jwtPayload = {
            id: existingUser[MongoFields.id],
            [MongoFields.username]: existingUser[MongoFields.username],
            role: existingUser[MongoFields.role_id],
            [MongoFields.kiot_id]: existingUser[MongoFields.kiot_id],
        };
        const token = jwtSign(jwtPayload, 60 * 24);

        res.send(
            RESPONSE(
                {
                    [ResponseFields.acceptToken]: token,
                },
                "Login successfully"
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE([], "Login unsuccessful", e.errors, e.message)
        );
    }
};

export const registerController = async (req, res) => {
    const { username, password, email, fullName, phone, address, gender } =
        req.body;

    try {
        //   1. Validation
        if (!username || !password || !fullName || !phone || !address)
            throw new Error("Missing required fields");

        // Tránh trùng username
        if (await user_getByUserName(username))
            throw new Error("User has already exist");

        // Tránh đăng ký 2 lần giống nhau
        const registerList = await registe_getOneByUserName(username);
        if (registerList) throw new Error("Register has already exist");

        // 3 Create new register object
        const newRegister = await register_create({
            username,
            password,
            email,
            fullName,
            phone,
            address,
            gender,
        });
        delete newRegister[MongoFields.doc].password;
        // 4. Response to client
        res.send(
            RESPONSE(
                {
                    [ResponseFields.userInfo]: newRegister,
                },
                "Register new user successfully"
            )
        );
    } catch (e) {
        res.status(400).send(
            RESPONSE([], "Register unsuccessful", e.errors, e.message)
        );
    }
};

export const getMeController = async (req, res) => {
    const { id } = req.users;
    console.log(req.users);
    try {
        const currentUser = await user_getById(id);

        res.send(
            RESPONSE(
                {
                    [ResponseFields.userInfo]: currentUser,
                },
                "Successfully"
            )
        );
    } catch (e) {
        res.status(400).send(RESPONSE([], "Unsuccessful", e.errors, e.message));
    }
};
