const express = require('express')
const dotenv = require('dotenv')
const passport = require('passport')
const session = require('express-session');
const bodyParser = require('body-parser');
const crypto = require('crypto')
const RedditStrategy = require('passport-reddit').Strategy

dotenv.config()
const app = express()

// express session middleware setup
app.use(session({
    secret: 'W$q4=25*8%v-}UV',
    resave: true,
    saveUninitialized: true
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});
// passport middleware setup ( it is mandatory to put it after session middleware setup)
app.use(passport.initialize());
app.use(passport.session());
// Use the RedditStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Reddit
//   profile), and invoke a callback with a user object.
//   callbackURL must match redirect uri from your app settings

passport.use(new RedditStrategy({
    clientID: process.env.REDDIT_KEY,
    clientSecret: process.env.REDDIT_SECRET,
    callbackURL: "http://127.0.0.1:8080/auth/reddit/callback"
},
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Reddit profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Reddit account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));

app.get("/", ensureAuthenticated, (req, res) => {
    res.send("STILL ALIVE BABEYYYYYY")
})

// GET /auth/reddit
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Reddit authentication will involve
//   redirecting the user to reddit.com.  After authorization, Reddit
//   will redirect the user back to this application at /auth/reddit/callback
//
//   Note that the 'state' option is a Reddit-specific requirement.
app.get('/auth/reddit', function (req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', {
        state: req.session.state,
    })(req, res, next);
});

// GET /auth/reddit/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/reddit/callback', function (req, res, next) {
    // Check for origin via state token
    if (req.query.state == req.session.state) {
        passport.authenticate('reddit', {
            successRedirect: '/',
            failureRedirect: '/login'
        })(req, res, next);
    }
    else {
        next(new Error(403));
    }
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
app.listen(process.env.SERVER_PORT, () => {
    console.log(`server started on http://localhost:${process.env.SERVER_PORT}`)
})

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth/reddit');
}