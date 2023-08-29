import { Router } from "express";
import { jwtCheck } from "../../middlewares/jwt.js";
import CreateRouter from "./create.js";
import ReadRouter from "./read.js";
import UpdateRouter from "./update.js";

const SaleOffRoute = Router();

SaleOffRoute.use(jwtCheck);
SaleOffRoute.use("/", ReadRouter);
SaleOffRoute.use("/create", CreateRouter);
SaleOffRoute.use("/update", UpdateRouter);

export default SaleOffRoute; 