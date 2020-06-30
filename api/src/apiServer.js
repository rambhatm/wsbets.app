const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()

const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const morgan = require('morgan')

//vuejs app production
//const publicRoot = '../app/dist'
const users = require('./userProfile');

//app.use(express.static(publicRoot))
// setup for body-parser module
app.use(morgan())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(express.logger());
app.use(cookieParser())
app.use(methodOverride());

// express session middleware setup
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

// passport middleware setup ( it is mandatory to put it after session middleware setup)
const reddit = require('./reddit')
reddit.initPassport(app)

//app.use(app.router)
/* Deployment stuff
app.get("/", (req, res, next) => {
    res.sendFile("index.html", { root: publicRoot })
})
*/

//Reddit authentication endpoints
app.use('api/auth/reddit',reddit.router)

//User profile
app.get("/api/auth/user", /*protectedEndpoint,*/ async(req, res) => {
    let user = await users.getProfile(req.param("userID"))
    res.send({ user: user })
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`server started on http://localhost:${process.env.SERVER_PORT}`)
})

