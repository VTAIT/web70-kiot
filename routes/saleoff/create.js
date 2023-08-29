import { Router } from "express";
import { create } from "../../controllers/saleoff.js";

const CreateRouter = Router();

CreateRouter.post('/', create);

export default CreateRouter;