import { Router } from "express";
import CreateRouter from "./create.js";
import { ProductModel } from "../../globals/mongodb.js";
import { jwtCheck } from "../../middlewares/jwt.js";

const ProductRoute = Router();

ProductRoute.get("/", jwtCheck, async (req, res) => {
    const kiot_id = req["kiot_id"];
    const _id = req.query["Did"];
    let productFromDb = [];
    
    if (_id) {
        productFromDb = await ProductModel.findOne({ _id });
    }
    else if (kiot_id) {
        productFromDb = await ProductModel.find({ kiot_id });
    };

    res.send({
        data: productFromDb,
        message: "Thành công"
    });
});

ProductRoute.use("/create", CreateRouter);

export default ProductRoute;