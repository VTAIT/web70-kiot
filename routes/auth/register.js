import { Router } from "express";
import { UserModel } from "../../globals/mongodb.js";
import { hashPassWord } from "../../globals/config.js";
import { jwtSign } from "../../globals/jwt.js";

const RegisterRouter = Router();

RegisterRouter.post("/", async (req, res) => {
    const { username, password, role_id, email, exspan } = req.body;

    if (!username || !password) {
        return res.send({ message: 'Missing information' });
    }

    const userFromDb = await UserModel.findOne({ username });

    if (userFromDb) {
        return res.send({ message: 'User already exists' });
    }

    const hash = await hashPassWord(password);

    const userDoc = new UserModel({ username, "password": hash, role_id , email, exspan});
    try {
        const susscess = await userDoc.save();
        if (!susscess) {
            return res.send({ message: 'unsuccessful' });
        }

        const payLoad = {
            id: userDoc._id,
            role: 'user'
        }

        const dataRespone = jwtSign(payLoad, 60);

        res.send({ token: dataRespone });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({ message: messages });
    }
})

export default RegisterRouter;