import { Router } from "express";
import { getMeController } from "../../controllers/auth.js";
import { jwtCheck } from "../../middlewares/jwt.js";

const MeRouter = Router();

MeRouter.use(jwtCheck);
MeRouter.get("/", getMeController);

export default MeRouter;
