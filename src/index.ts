import path from "path"
import env from "dotenv";
env.config({ path: "../.env" });
import express from "express"

import v1 from "./routes/api/v1"
import home from "./routes/home/home"

const app: express.Application = express();
app.use("/static", express.static(path.resolve(__dirname, "../static")))

app.set('view engine', 'pug')
app.set('views', "../views")

app.use('/api/v1', v1);
app.use('/', home)

app.listen(8080, () => console.log("Server Started."))