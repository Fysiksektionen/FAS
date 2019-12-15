import express from "express"
import * as apiController from "./controllers/api"

const app = express()
app.set("port", process.env.PORT || 8080)

app.get("/api", apiController.helloworld)

export default app
