import { Router } from "express";
import AuthRoute from "./auth/index.js";
import ProductRoute from "./product/index.js";
import AccountRoute from "./account/index.js";
import KiotRoute from "./kiot/index.js";
import CustomerRoute from "./customer/index.js";
import TransactionRoute from "./transaction/index.js";
import SaleOffRoute from "./saleoff/index.js";
import ImageRoute from "./image/index.js";

const RootRoute = Router();

RootRoute.use("/auth", AuthRoute);
RootRoute.use("/product", ProductRoute);
RootRoute.use("/account", AccountRoute);
RootRoute.use("/kiot", KiotRoute);
RootRoute.use("/customer", CustomerRoute);
RootRoute.use("/transaction", TransactionRoute);
RootRoute.use("/saleoff", SaleOffRoute);
RootRoute.use("/image", ImageRoute);

export default RootRoute;