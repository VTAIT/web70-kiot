import { Router } from "express";
import { jwtCheck } from "../../middlewares/jwt.js";
import CreateRouter from "./create.js";
import ReadRouter from "./read.js";
import UpdateRouter from "./update.js";

const CustomerRoute = Router();

CustomerRoute.use(jwtCheck);
CustomerRoute.use("/", ReadRouter);
CustomerRoute.use("/create", CreateRouter);
CustomerRoute.use("/update", UpdateRouter);

export default CustomerRoute; 