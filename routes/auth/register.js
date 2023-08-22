import { Router } from "express";
import { registerController } from "../../controllers/auth.js";

const RegisterRouter = Router();

RegisterRouter.post("/", registerController);

export default RegisterRouter;