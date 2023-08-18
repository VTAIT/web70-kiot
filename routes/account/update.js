import { Router } from "express";
import { UserModel } from "../../globals/mongodb.js";
import { jwtCheck } from '../../middlewares/jwt.js';
import { ObjectId } from "mongodb";

const UpdateRouter = Router();

UpdateRouter.post('/', jwtCheck, async (req, res) => {
    const id = req.id;
    const role = req.role;
    const kiot_id = req.kiot_id;

    const { name_product, price, image } = req.body;

    const AccountFromDb = await UserModel.findOne({ _id: new ObjectId(id) });
    if (!AccountFromDb) {
        return res.send({ messeger: 'User does not exist' });
    }

    const category = 0;
    const code = ""

    const model = new ProductModel({ 
        kiot_id, 
        name_product, 
        price, 
        image, 
        user_id: id, 
        category, 
        code });
    try {
        await model.save();
        res.send({ message: "Sửa thành công" });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({ 
            error: messages,
            message: "Sửa không thành công" 
        });
    }
});

export default UpdateRouter;