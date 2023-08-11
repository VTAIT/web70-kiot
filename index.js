import express from 'express'
import 'dotenv/config'

const env = process.env;
const app = express();
const PORT_DEFAULT = 3001;




app.listen(env.PORT || PORT_DEFAULT, () => {
    console.log(`Server listening on port ${env.PORT}`);
});