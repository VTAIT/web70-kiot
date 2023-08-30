import { Router } from "express";
import { update } from "../../controllers/product.js";

const UpdateRouter = Router();

UpdateRouter.post("/", update);

export default UpdateRouter;
