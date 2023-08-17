import { Router } from "express";
import { UserModel } from "../../globals/mongodb.js";
import { comparePassWord } from "../../globals/config.js";
import { jwtSign } from "../../globals/jwt.js";

const LoginRouter = Router();

LoginRouter.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send({ messeger: 'Missing information' });
    }

    const userFromDb = await UserModel.findOne({ username });
    console.log(username, userFromDb)
    if (!userFromDb) {
        return res.send({ messeger: 'User does not exist' });
    }

    if (! await comparePassWord(password, userFromDb.password)) {
        console.log(password, userFromDb.password)
        return res.send({ messeger: 'User does not exist' });
    }

    const payLoad = {
        id: userFromDb._id,
        role: userFromDb.role
    }

    const dataRespone = jwtSign(payLoad, 60);

    res.send({ token: dataRespone });
})

export default LoginRouter;