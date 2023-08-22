import { Router } from "express";
import { jwtCheck } from "../../middlewares/jwt.js";
import CreateRouter from "./create.js";
import ReadRouter from "./read.js";
import UpdateRouter from "./update.js";

const ProductRoute = Router();

ProductRoute.use(jwtCheck);
ProductRoute.use("/", ReadRouter);
ProductRoute.use("/create", CreateRouter);
ProductRoute.use("/update", UpdateRouter);

export default ProductRoute; 