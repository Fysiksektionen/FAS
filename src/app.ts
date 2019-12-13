import express from "express"
import * as apiController from "./controllers/api"

const app = express()
app.set("port", process.env.PORT || 3000)

app.get("/", apiController.helloworld)

export default app
