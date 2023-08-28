import { Router } from "express";
import { create } from "../../controllers/product.js";
import uploadFile from "../../globals/multer.js";
import getUrlImage from "../../middlewares/getUrlImage.js";

const CreateRouter = Router();

CreateRouter.post("/", uploadFile.single("image"), getUrlImage, create);

export default CreateRouter;
