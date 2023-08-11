import { Base_Model } from "./base_model.js";

class Base_Info extends Base_Model {
    fullName;
    username;
    phone;
    email;
    address;

    constructor(data) {
        super();
        this.fullName = data.fullName ? data.fullName : "";
        this.username = data.username ? data.username : "";
        this.phone = data.phone ? data.phone : "";
        this.email = data.email ? data.email : "";
        this.address = data.address ? data.address : "";
    }
}

export { Base_Info };