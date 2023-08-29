import { Router } from "express";
import { create } from "../../controllers/image.js";

const CreateRouter = Router();

CreateRouter.post('/', create);

export default CreateRouter;