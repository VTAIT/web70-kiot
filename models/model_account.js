import { Base_Info } from "./base_info.js";

class ModelAccount extends Base_Info {
    kiot_id;
    gender;
    password;
    role_id;

    constructor(data) {
        super(data);
        this.kiot_id = data.kiot_id;
        this.gender = data.gender;
        this.role_id = !data?.role_id ? 1 : data.role_id;
        this.password = data.password ? data.password : '123456';
    }
};

// const data = {
//     transactionHistory: ['dsdklfj'],
//     rank: 3,
//     role_id: 5,
//     password:'sfdsdf'
// };

// const model = new ModelAccount(data);
// console.log(model)

export { ModelAccount };