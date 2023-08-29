import { Router } from "express";
import { update } from "../../controllers/product.js";
import uploadFile from "../../globals/multer.js";
import getUrlImage from "../../middlewares/getUrlImage.js";

const UpdateRouter = Router();

UpdateRouter.post("/", uploadFile.single("image"), getUrlImage, update);

export default UpdateRouter;
