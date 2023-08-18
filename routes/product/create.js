import { Router } from "express";
import { ProductModel } from "../../globals/mongodb.js";
import { jwtCheck } from '../../middlewares/jwt.js';

const CreateRouter = Router();

CreateRouter.post('/', jwtCheck, async (req, res) => {
    const id = req.id;
    const role = req.role;
    const kiot_id = req.kiot_id;

    const { name_product, price, image } = req.body;

    if (!kiot_id || !name_product || !price) {
        return res.send({ messeger: 'Missing information' });
    }

    const productFromDb = await ProductModel.findOne({ name_product, kiot_id });
    if (productFromDb) {
        return res.send({ messeger: 'Product already exist' });
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
        res.send({ message: "Thêm thành công" });
    } catch (e) {
        let messages = [];
        for (const key in e.errors) {
            const element = e.errors[key];
            messages.push(element.message);
        }
        res.send({ 
            error: messages,
            message: "Thêm không thành công" 
        });
    }
});

export default CreateRouter;