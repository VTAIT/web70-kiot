import { Router } from "express";
import { create } from "../../controllers/transaction.js";

const CreateRouter = Router();

CreateRouter.post('/', create);

export default CreateRouter;