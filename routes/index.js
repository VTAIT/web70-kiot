import { Router } from "express";
import RegisterRouter from "./register.js";
import LoginRouter from "./login.js";

const RootRoute = Router();

RootRoute.use("/register", RegisterRouter);
RootRoute.use("/login", LoginRouter);

export default RootRoute;