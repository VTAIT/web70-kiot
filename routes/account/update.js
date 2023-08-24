import { Router } from "express";
import { update } from "../../controllers/account.js";
import { CheckRoleAccount } from "../../middlewares/check.js";

const UpdateRouter = Router();
UpdateRouter.use(CheckRoleAccount);
UpdateRouter.post('/', update);

export default UpdateRouter;