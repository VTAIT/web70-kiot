import { Router } from "express";
import UpdateRouter from "./update.js";
import { ProductModel } from "../../globals/mongodb.js";

const AccountRoute = Router();

AccountRoute.get("/", async (req, res) => {
    const kiot_id = req.query["Tid"];
    const _id = req.query["Did"];
    let productFromDb = [];

    if (kiot_id) {
        productFromDb = await ProductModel.find({ kiot_id });
    }
    else if (_id) {
        productFromDb = await ProductModel.findOne({ _id });
    };
    
    res.send({
        data: productFromDb,
        message: "Thành công"
    });
});

AccountRoute.use("/update", UpdateRouter);

export default AccountRoute;