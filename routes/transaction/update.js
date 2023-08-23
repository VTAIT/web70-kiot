import { Router } from "express";
import { update } from "../../controllers/transaction.js";

const UpdateRouter = Router();

UpdateRouter.post('/', update);

export default UpdateRouter;