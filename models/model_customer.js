import { Base_Info } from "./base_info.js";

class ModelCustomer extends Base_Info {
    kiot_id;
    gender;
    transactionHistory;
    rank;

    constructor(data){
        super(data);
        this.kiot_id = data.kiot_id;
        this.gender = data.gender;
        this.rank = !data?.rank ? 1 : data.rank;
        this.transactionHistory = !data.transactionHistory?.length ? [] : data.transactionHistory;
    }
};

// const data = {
//     transactionHistory: ['dsdklfj'],
//     rank: 3
// };

// const model = new ModelCustomer(data);
// console.log(model)

export { ModelCustomer };