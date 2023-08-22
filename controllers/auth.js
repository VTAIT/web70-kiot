import { comparePassWord, hashPassWord } from "../globals/config.js";
import { jwtSign } from "../globals/jwt.js";
import { UserModel, RegisterModel } from "../globals/mongodb.js";

export const loginController = async (req, res) => {
    const { username, password } = req.body;

    try {
        //   1. Validation
        if (!username || !password) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }
        //   2. Check authentication
        const existingUser = await UserModel.findOne({ username });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid credentials!",
            });
        }

        // 3. Check password
        const isMatchPassword = await comparePassWord(password, existingUser.password);
        if (!isMatchPassword) {
            return res.status(401).json({
                message: "Username or password is not correct!",
            });
        }

        // Create JWT Token & Response to client
        const jwtPayload = {
            id: existingUser._id,
            username,
            role: existingUser.role_id,
            kiot_id: existingUser.kiot_id
        };

        const token = jwtSign(jwtPayload, 60);

        res.json({
            accessToken: token,
            message: "Login successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.status(500).json({
            error: messages,
        });
    }
};

export const registerController = async (req, res) => {
    const { username, password, email, fullName, phone, address } = req.body;

    try {
        //   1. Validation
        if (!username || !password || !fullName || !phone || !address) {
            return res.status(400).json({
                message: "Missing required fields",
            });
        }

        // find User by email
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.json({
                message: "User has already exist",
            });
        }

        const existingRegister = await RegisterModel.findOne({ username });

        if (existingRegister) {
            return res.json({
                message: "Register has already exist",
            });
        }

        // 3. Create new user, insert into DB
        // 3.1 Has password (mã hoá password)
        const hashedPassword = await hashPassWord(password);

        // 3.2 Create new register object
        const newRegister = new RegisterModel({
            username,
            password: hashedPassword,
            email,
            fullName,
            phone,
            address,
            status: 0
        });

        // Insert new record into collection
        await newRegister.save();
        
        // 4. Response to client
        res.status(201).json({
            user: newRegister,
            message: "Register new user successfully",
        });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }

        res.status(500).json({
            error: messages,
        });
    }
};

export const getMeController = async (req, res) => {
    const { id } = req.users;
    const currentUser = await UserModel.findById(id).select("-password");

    res.json({
        userInfo: currentUser,
    });
};
