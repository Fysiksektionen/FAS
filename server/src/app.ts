import express from "express"
import session, { MemoryStore } from "express-session"

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
if (app.get("env") !== 'testing') {
    // Use database connection when not testing.
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
else {
    // Memorystore for testing environment to avoid mongodb connections
    // not suitable for production.
    store = new MemoryStore()
}

/* Set up a session store, exposes req.session. */
app.use( session({
    secret            : 'super secret key',
    resave            : false,
    saveUninitialized : false,
    store             : store
}));


/* Middleware setup */
// exposes json request attributes on req.body
app.use(bodyParser.json())

let casAuth; // initialise depending on environment below
if (app.get("env") !== 'production') { 
    // app.get("env") reads the NODE_ENV environment 
    // variable, uses 'development' if not found
    const corsOptions = {
        origin: 'http://localhost:3000',  // react frontend during development
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    app.use(cors(corsOptions))
    casAuth = CAS(CASOptionsDev) // development settings
}
else{
    casAuth = CAS(CASOptionsPro) // production settings
}

/* API routes */
app.get("/api/groups", apiController.getGroups)

/* Other routes */
// just to test
app.get("/", casAuth.bounce, (req,res) => res.json({name:req.session['cas_user']}))

export default app
