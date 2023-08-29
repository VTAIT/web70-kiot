import { Router } from "express";
import { jwtCheck } from "../../middlewares/jwt.js";
import CreateRouter from "./create.js";
import ReadRouter from "./read.js";
import { uploadFile } from "../../middlewares/multer.js";

const ImageRoute = Router();

ImageRoute.use(jwtCheck);
ImageRoute.use("/", ReadRouter);
ImageRoute.use("/create", uploadFile.single("image"), CreateRouter);

export default ImageRoute; 