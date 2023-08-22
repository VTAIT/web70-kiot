import { Router } from "express";
import { jwtCheck } from "../../middlewares/jwt.js";
import ReadRouter from "./read.js";
import UpdateRouter from "./update.js";

const KiotRoute = Router();

KiotRoute.use(jwtCheck);
KiotRoute.use("/", ReadRouter);
KiotRoute.use("/update", UpdateRouter);

export default KiotRoute;