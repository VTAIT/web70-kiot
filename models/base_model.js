import { formatDate } from "../utils/index.js";
import { ObjectId } from 'mongodb'

class Base_Model {
    _id;
    active;
    createDate;
    updateDate;

    constructor() {
        const currentDate = formatDate('DD-MM-YYYY');
        this._id = new ObjectId();
        this.active = true;
        this.createDate = currentDate;
        this.updateDate = currentDate;
    }
}

export { Base_Model };