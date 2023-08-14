import { Router } from "express";
import { UserModel } from "../globals/mongodb.js";
import { hashPassWord } from "../globals/config.js";

const RegisterRouter = Router();

RegisterRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send([]);
    }

    const userFromDb = await UserModel.findOne({ username });
    
    if (userFromDb){
        return res.send({messeger : 'Exitst'});
    }

    const hash = await hashPassWord(password);

    const userDoc = new UserModel({ username, "password": hash });
    await userDoc.save();

    res.send({ username })
    })

export default RegisterRouter;