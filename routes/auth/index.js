import { Router } from "express";
import RegisterRouter from "./register.js";
import LoginRouter from "./login.js";
import MeRouter from "./me.js";

const AuthRoute = Router();

AuthRoute.use("/register", RegisterRouter);
AuthRoute.use("/login", LoginRouter);
AuthRoute.use("/me", MeRouter);

export default AuthRoute;