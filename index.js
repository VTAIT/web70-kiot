import express from "express";
import { env } from "./globals/config.js";
import RootRoute from "./routes/index.js";
import { connectDB } from "./globals/mongodb.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const PORT_DEFAULT = 3001;
connectDB();

app.use(`/api/${env.VERSION}`, RootRoute);

app.listen(env.PORT || PORT_DEFAULT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});
