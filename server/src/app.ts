import express from "express"
import * as apiController from "./controllers/api"
import cors from "cors"

const app = express()

// app.get("env") reads the NODE_ENV environment variable, uses 'development' if not found
if (app.get("env") === 'development') {
    const corsOptions = {
        origin: 'http://localhost:3000',  // react frontend during development
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    app.use(cors(corsOptions))
}

app.set("port", process.env.PORT || 8080)

app.get("/api/groups", apiController.getGroups)

app.get("/api/groups", apiController.getMap)

export default app
