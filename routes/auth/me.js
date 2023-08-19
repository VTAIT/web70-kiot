import { Router } from "express";
import { jwtVerify } from "../../globals/jwt.js";
import { AUTH } from "../../globals/api.js";

const MeRouter = Router();

MeRouter.get("/", (req, res) => {
  const token = req.headers[AUTH.accept_token];
  const payLoad = jwtVerify(token);
  if (!payLoad) {
    return res.send({ messager: " Invalid data" });
  } else {
  }

  res.send({
    userInfo: {
      id: payLoad.id,
      username: payLoad.username,
      role: payLoad.role,
      kiot_id: payLoad.kiot_id,
    },
  });
});

export default MeRouter;
