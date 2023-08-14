import { Router } from "express";
import { UserModel } from "../globals/mongodb.js";
import { comparePassWord } from "../globals/config.js";

const LoginRouter = Router();

LoginRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send([]);
    }

    const userFromDb = await UserModel.findOne({ username });

    if (!userFromDb) {
        return res.send({ messeger: 'Not Exitst' });
    }

    if (! await comparePassWord(password, userFromDb.password)){
        return res.send({ messeger: 'Not Exitst' });
    }

    res.send(userFromDb)
})

export default LoginRouter;