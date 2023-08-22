import { Router } from "express";
import { create } from "../../controllers/account.js";

const CreateRouter = Router();

CreateRouter.post("/", create);

export default CreateRouter;