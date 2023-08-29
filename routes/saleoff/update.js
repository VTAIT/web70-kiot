import { Router } from "express";
import { update } from "../../controllers/saleoff.js";

const UpdateRouter = Router();

UpdateRouter.post('/', update);

export default UpdateRouter;