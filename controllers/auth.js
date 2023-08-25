import { comparePassWord } from "../globals/config.js";
import { jwtSign } from "../globals/jwt.js";
import { user_getById, user_getByUserName } from '../services/mongo/user.js';
import { registe_getByUserName, register_create } from '../services/mongo/register.js';

export const loginController = async (req, res) => {
    const { username, password } = req.body;

    try {
        //   1. Validation
        if (!username || !password) throw new Error("Missing required fields");

        //   2. Check authentication
        const existingUser = await user_getByUserName(username, true);

        if (!existingUser) throw new Error("Invalid credentials!");

        // 3. Check password
        const isMatchPassword = await comparePassWord(password, existingUser.password);
        if (!isMatchPassword) throw new Error("Username or password is not correct!");

        // Create JWT Token & Response to client
        const jwtPayload = {
            id: existingUser._id,
            username: existingUser.username,
            role: existingUser.role_id,
            kiot_id: existingUser.kiot_id
        };

        const token = jwtSign(jwtPayload, 60 * 24);

        res.json({
            data: token,
            message: "Login successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(400).json({
            message: "Login unsuccessfully",
            error: messages,
            catch: e.message
        });
    }
};

export const registerController = async (req, res) => {
    const { username, password, email, fullName, phone, address, gender } = req.body;

    try {
        //   1. Validation
        if (!username || !password || !fullName || !phone || !address) throw new Error("Missing required fields");

        // Tránh trùng username
        if (await user_getByUserName(username)) throw new Error("User has already exist");

        // Tránh đăng ký 2 lần giống nhau
        if (await registe_getByUserName(username)) throw new Error("Register has already exist")

        // 3 Create new register object
        const newRegister = await register_create({
            username,
            password,
            email,
            fullName,
            phone,
            address,
            gender
        });

        // 4. Response to client
        res.json({
            data: newRegister,
            message: "Register new user successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }

        res.status(400).json({
            message: "Register unsuccessfully",
            error: messages,
            catch: e.message
        });
    }
};

export const getMeController = async (req, res) => {
    const { id } = req.users;
    try {
        const currentUser = await user_getById(id);

        res.json({
            data: currentUser,
            message: "Successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }

        res.status(400).json({
            message: "Register unsuccessfully",
            error: messages,
            catch: e.message
        });
    }

};
