import { Base_Model } from "./base_model.js";

class ModelTransaction extends Base_Model {
    kiot_id;
    status;
    deposit;
    return;
    retrun_id;
    product_id;

    constructor(data) {
        super();
        this.kiot_id = data.kiot_id;
        this.status = data.status ? data.status : 'Chưa thanh toán';
        this.deposit = data.deposit ? data.deposit : 0;
        this.return = data.return ? data.return : 0;
        this.product_id = !data.product_id?.length ? [] : data.product_id;
        this.retrun_id = !data.retrun_id?.length ? [] : data.retrun_id;
    }
}

// const data = {
//     transactionHistory: ['dsdklfj'],
//     rank: 3,
//     role_id: 5,
//     password:'sfdsdf'
// };

// const model = new ModelTransaction(data);
// console.log(model)

export { ModelTransaction};