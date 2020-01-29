import express from "express"

/* Middleware and controllers */
import cors from "cors"
import bodyParser from "body-parser"
import session from "express-session"

import * as apiController from "./controllers/api"

import CAS from "./controllers/auth"
import { CASOptionsDev, CASOptionsPro} from "./lib/casOptions"


/* Session store */
const MongoStore = require('connect-mongo')(session)
const store = new MongoStore({
    url: "mongodb://localhost:27017/FAS",
    // TODO: re-enable this when
    // https://github.com/jdesboeufs/connect-mongo/issues/277 is fixed:
    // mongooseConnection: db
});


/* Initialise app */
const app = express()
app.set("port", process.env.PORT || 8080)

/* Set up a session store, exposes req.session. */
app.use( session({
    secret            : 'super secret key',
    resave            : false,
    saveUninitialized : false,
    store             : store
}));

/* Middleware setup */

// exposes response attributes on req.body */
app.use(bodyParser.json())

let casAuth; // initialise depending on environment below

if (app.get("env") === 'development') { 
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

/* API */
app.get("/api/groups", apiController.getGroups)

/* Other routes */
// just to test
app.get("/", casAuth.bounce, (req,res) => res.json({name:req.session['cas_user']}))

export default app
