import { Router } from "express";
import UpdateRouter from "./update.js";
import { jwtCheck } from "../../middlewares/jwt.js";
import ReadRouter from "./read.js";
import CreateRouter from "./create.js";
import AcceptRouter from "./accept.js";

const AccountRoute = Router();

AccountRoute.use(jwtCheck);
AccountRoute.use("/", ReadRouter);
AccountRoute.use("/create", CreateRouter);
AccountRoute.use("/update", UpdateRouter);
AccountRoute.use("/accept", AcceptRouter);

export default AccountRoute;