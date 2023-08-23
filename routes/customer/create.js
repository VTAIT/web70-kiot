import { Router } from "express";
import { create } from "../../controllers/customer.js";

const CreateRouter = Router();

CreateRouter.post('/', create);

export default CreateRouter;