import { Router } from "express";
import AuthRoute from "./auth/index.js";
import ProductRoute from "./product/index.js";
import AccountRoute from "./account/index.js";

const RootRoute = Router();

RootRoute.use("/auth", AuthRoute);
RootRoute.use("/product", ProductRoute);
RootRoute.use("/account", AccountRoute);

export default RootRoute;