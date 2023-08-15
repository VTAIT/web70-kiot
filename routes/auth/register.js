import { Router } from "express";
import { UserModel } from "../../globals/mongodb.js";
import { hashPassWord } from "../../globals/config.js";
import { jwtSign } from "../../globals/jwt.js";

const RegisterRouter = Router();

RegisterRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send({ messeger: 'Missing information' });
    }

    const userFromDb = await UserModel.findOne({ username });

    if (userFromDb) {
        return res.send({ messeger: 'User already exists' });
    }

    const hash = await hashPassWord(password);

    const userDoc = new UserModel({ username, "password": hash });
    const susscess = await userDoc.save();

    if (!susscess) {
        return res.send({ messeger: 'unsuccessful' });
    }

    const payLoad = {
        id: userDoc._id,
        role: 'user'
    }

    const dataRespone = jwtSign(payLoad, 60);
    
    res.send({ token: dataRespone });
})

export default RegisterRouter;