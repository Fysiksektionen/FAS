import express from "express"
import session, { MemoryStore } from "express-session"
import path from "path"

const mongoose = require("mongoose")
const MongoStore = require('connect-mongo')(session)

/* Middleware and controllers */
import cors from "cors"
import bodyParser from "body-parser"

import * as apiController from "./controllers/api"

import CAS from "./controllers/auth"
import { CASOptionsDev, CASOptionsPro} from "./lib/CASOptions"

/* Initialise app */
const app = express()
app.set("port", process.env.PORT || 8080)

/* Session store */
let store;
if (app.get("env") === 'testing' || process.env.FAS_USE_DEV_MEMSTORE === 'true') {
    // Memorystore for testing environment to avoid mongodb connections
    // NOTE: NOT suitable for production.
    store = new MemoryStore()
}
else { // Use real database connection when not testing.
    app.set("mongourl", "mongodb://localhost:27017/FAS")
    mongoose.promise = Promise
    mongoose.connect(
        app.get("mongourl"), 
        { useNewUrlParser: true , useUnifiedTopology: true }
    );
    store = new MongoStore({
        // connection through mongoose has better connection
        // cleanup than using url: app.get("mongourl")
        mongooseConnection: mongoose.connection
    });
}

/* Set up a session store, exposes req.session. */
app.use(session({
    secret            : 'super secret key',
    resave            : false,
    saveUninitialized : false,
    store             : store
}));


/* Middleware setup */
// exposes json request attributes on req.body
app.use(bodyParser.json())


// initialise CAS depending on environment below
let casAuth; 

switch (app.get("env")){
    case "production":
        casAuth = CAS(CASOptionsPro) // production settings
        break
    case "staging":
        casAuth = CAS(CASOptionsDev) // development settings
        break
    case "testing":
        casAuth = CAS(CASOptionsDev) // development settings
        // this route is for testing
        app.get("/block_unauthorized", casAuth.block, (req,res)=>res.send("Your request was not blocked"))
        break
    default: // env development
        const corsOptions = {
            origin: 'http://localhost:3000',  // react frontend during development
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }
        app.use(cors(corsOptions))
        casAuth = CAS(CASOptionsDev) // development settings
        break
}

/* API routes */
app.use("/api/", casAuth.block)  // middleware to block every unauthorized api request
app.get("/api/directory/map", apiController.getMap)

// correlates to the api.ts, DirectoryApi.ts
// could use post for every one.
app.post("/api/directory/creategroup", apiController.createGroup)
app.delete("/api/directory/deletegroup", apiController.deleteGroup)
app.patch("/api/directory/editgroup", apiController.editGroupInfo)
app.post("/api/directory/addmember", apiController.addMember)
app.delete("/api/directory/removemember", apiController.removeMember)
app.patch("/api/directory/editmember", apiController.editMember)
app.post("/api/directory/createuser", apiController.createUser)
app.delete("/api/directory/deleteuser", apiController.deleteUser)
app.put("/api/directory/edituser", apiController.editUser)

app.post("/api/directory/addaliastogroup", apiController.addAliasToGroup)
app.post("/api/directory/removealiasfromgroup", apiController.removeAliasFromGroup)


app.get("/api/me", (req,res) => res.json({authenticated: true, name:req.session['cas_user'], data:req.session}))

/* Other routes */
app.get("/login", casAuth.bounce_redirect) // requires 
app.get("/logout", casAuth.logout)
// app.get("/", casAuth.bounce, (req,res) => res.send("Temporary homepage"))

// In production it is run in /server/dist/server/src/server.js, so go back 4 dirs.
// for consistency the FAS_ROOT_DIR env var should be set to the absolute path of the project.
const FAS_ROOT_DIR = process.env.FAS_ROOT_DIR || path.join(__dirname, '../../../../')
app.set('static_folder', path.join(FAS_ROOT_DIR, 'client/build'))
// this clause needs to be at the end since we want the backend routes to run first.
if (["production", "staging"].includes(app.get("env"))){
    app.use('/', express.static(app.get('static_folder')))
    // send index.html if the route is not found.
    // this part is crucial in order to work with react router for
    // views like /groups 
    app.get('*', (req, res) => {
        res.sendFile('index.html', {root: path.join(FAS_ROOT_DIR, 'client/build/')});
    })
}

export default app
