import { jwtVerify } from "../globals/jwt.js";
import { AUTH } from '../globals/api.js'

const jwtCheck = (req, res, next) => {
    const token = req.headers[AUTH.accept_token];
    const payLoad = jwtVerify(token);

    if (!payLoad) {
        return res.send({ messager: " Invalid data" })
    }

    if (!payLoad.id) {
        return res.send({ messager: " Invalid data" })
    }

    if (!payLoad.role) {
        return res.send({ messager: " Invalid data" })
    }

    if (!payLoad.kiot_id) {
        return res.send({ messager: " Invalid data" })
    }

    req.id = payLoad.id;
    req.role = payLoad.role;
    req.kiot_id = payLoad.kiot_id;

    next();
}

export { jwtCheck };