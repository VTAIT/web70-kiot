import { Base_Info } from "./base_info.js";

class ModelKiot extends Base_Info {
    describe;
    image;

    constructor(data) {
        super(data);
        this.describe = data.describe ? data.describe : '';
        this.image = data.image ? data.image : '';
    }
}

export { ModelKiot };