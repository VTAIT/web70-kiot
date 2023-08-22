import { Router } from "express";
import { loginController } from "../../controllers/auth.js";


const LoginRouter = Router();

LoginRouter.post("/", loginController);

export default LoginRouter;