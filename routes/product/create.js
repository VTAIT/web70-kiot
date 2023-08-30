import { Router } from "express";
import { create } from "../../controllers/product.js";

const CreateRouter = Router();

CreateRouter.post("/", create);

export default CreateRouter;
