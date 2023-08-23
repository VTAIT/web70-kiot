import { Router } from "express";
import { jwtCheck } from "../../middlewares/jwt.js";
import CreateRouter from "./create.js";
import ReadRouter from "./read.js";
import UpdateRouter from "./update.js";

const TransactionRoute = Router();

TransactionRoute.use(jwtCheck);
TransactionRoute.use("/", ReadRouter);
TransactionRoute.use("/create", CreateRouter);
TransactionRoute.use("/update", UpdateRouter);

export default TransactionRoute; 