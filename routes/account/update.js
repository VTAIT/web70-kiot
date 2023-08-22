import { Router } from "express";
import { update } from "../../controllers/account.js";

const UpdateRouter = Router();

UpdateRouter.post('/', update);

export default UpdateRouter;