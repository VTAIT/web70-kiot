import { Router } from "express";
import { create } from "../../controllers/account.js";
import { CheckRoleAccount } from "../../middlewares/check.js";

const CreateRouter = Router();
CreateRouter.use(CheckRoleAccount);
CreateRouter.post("/", create);

export default CreateRouter;