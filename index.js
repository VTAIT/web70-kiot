import express from 'express'
import 'dotenv/config'

const env = process.env;
const app = express();
const PORT_DEFAULT = 3001;

/**
 * Base: /api/v1
 * End Point
 * query: ?token
 *  
 * 1. login: post /login
 * 2. signup: post /signup -> role: nếu là admin thì không cần supper duyệt
 * 
 * 3. users: get /users
 * 4. userById: get /users/:id
 * 5. update/delete userById: post /users
 * 
 * 6. kiots: get /kiots
 * 7. kiotById: get /kiots/:id
 * 8. update/delete kiotById: post /kiots
 * 
 * 9. customers: get /customers
 * 10. customerById: get /customers/:id
 * 11. update/delete customerById: post /customers
 * 
 * 12. transactions : get /transactions
 * 13. transactionById: get /transactions/:id
 * 14. update/delete transactionById: post /transactions
 *
 * 15. products : get /products
 * 16. productnById: get /products/:id
 * 17. update/delete productById: post /products
 * 
 * 18. create user : post /users/create
 * 19. create kiot: post /kiots/create
 * 20. create customers: post /customers/create
 * 21. create transactions: post /transactions/create
 * 22. create products: post /products/create
 * 
 * 23. report : get /report:id
 */


app.listen(env.PORT || PORT_DEFAULT, () => {
    console.log(`Server listening on port ${env.PORT}`);
});