import { Router } from "express";
import { update } from "../../controllers/customer.js";

const UpdateRouter = Router();

UpdateRouter.post('/', update);

export default UpdateRouter;