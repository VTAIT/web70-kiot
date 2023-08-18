import { Router } from "express";
import { UserModel , RegisterModel } from "../../globals/mongodb.js";
import { hashPassWord } from "../../globals/config.js";

const RegisterRouter = Router();

RegisterRouter.post("/", async (req, res) => {
    const { username, password, email, full_name, phone, address } = req.body;

    if (!username || !password || !full_name || !phone || !address) {
        return res.send({ message: 'Missing information' });
    }

    const userFromDb = await UserModel.findOne({ username });

    if (userFromDb) {
        return res.send({ message: 'User already exists' });
    }

    const hash = await hashPassWord(password);

    const userDoc = new RegisterModel({ 
        username, 
        password: hash,
        email,
        full_name,
        phone,
        address,
        status: 0
        });
        
    try {
        const susscess = await userDoc.save();
        if (!susscess) {
            return res.send({ message: 'unsuccessful' });
        }

        res.send({ message: "Đăng ký thành công"  });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({ 
            error: messages,
            message: "Đăng ký không thành công" 
        });
    }
})

export default RegisterRouter;