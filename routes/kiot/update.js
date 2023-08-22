import { Router } from "express";
import { update } from "../../controllers/kiot.js";

const UpdateRouter = Router();

UpdateRouter.post('/', update);

export default UpdateRouter;