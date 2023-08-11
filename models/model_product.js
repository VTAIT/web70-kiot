import { Base_Model } from "./base_model.js";

class ModelProduct extends Base_Model {
    kiot_id;
    name_product;
    price;
    image;

    constructor(data) {
        super();
        this.kiot_id = data.kiot_id;
        this.name_product = data.name_product ? data.name_product : '';
        this.price = data.price ? data.price : 0;
        this.image = data.image ? data.image : '';
    }
}

// const data = {
//     transactionHistory: ['dsdklfj'],
//     rank: 3,
//     role_id: 5,
//     password:'sfdsdf'
// };

// const model = new ModelProduct(data);
// console.log(model)

export { ModelProduct };