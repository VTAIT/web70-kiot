import { Base_Account } from "./base_info.js";


const data = {
    fullName: 'abc',
    username: 'bcd',
    phone: 'sdklfjsdjkf',
    email: ' flkdsjkdf',
    address: 'kladjfskldajf'
}

const account = new Base_Account(data);

console.log(account._id, account.fullName, account.createDate)