/*
    /auth/reddit/
    Handles reddit user authentication
*/
const crypto = require('crypto')
const passport = require('passport')
const router = require('express').Router()
const { authenticate } = require('passport');
const RedditStrategy = require('passport-reddit').Strategy
const {getUserProfile,createNewUser } = require('./userProfile')

router.get("/", login)
router.get("/callback", loginCallback)
router.get("/logout", logout)

module.exports = {
    initPassport: (app) => {
        app.use(passport.initialize())
        app.use(passport.session())

        passport.serializeUser(function (user, done) {
            done(null, user)
        });

        passport.deserializeUser(function (obj, done) {
            done(null, obj)
        });

        // Use the RedditStrategy within Passport.
        //   Strategies in Passport require a `verify` function, which accept
        //   credentials (in this case, an accessToken, refreshToken, and Reddit
        //   profile), and invoke a callback with a user object.
        //   callbackURL must match redirect uri from your app settings

        passport.use(new RedditStrategy({
            clientID: process.env.REDDIT_KEY,
            clientSecret: process.env.REDDIT_SECRET,
            callbackURL: "http://127.0.0.1:3000/api/auth/reddit/callback"
        },
            async function (accessToken, refreshToken, profile, done) {
                let userProfile = await getUserProfile(profile.id)
                if (userProfile) {
                    done(null, userProfile)
                } else {
                    await createNewUser(profile.id, profile)
                    done(null, Profile)
                }
            }
        ));
    },
    // Simple route middleware to ensure user is authenticated.
    //   Use this route middleware on any resource that needs to be protected.  If
    //   the request is authenticated (typically via a persistent login session),
    //   the request will proceed.  Otherwise, the user will be redirected to the
    //   login page.
    protectAPI: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/api/auth/reddit')
    },

    router: router


}

// GET /auth/reddit
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Reddit authentication will involve
//   redirecting the user to reddit.com.  After authorization, Reddit
//   will redirect the user back to this application at /auth/reddit/callback
//
//   Note that the 'state' option is a Reddit-specific requirement.
function login(req, res, next) {
    req.session.state = crypto.randomBytes(32).toString('hex')
    console.log(req.session.state)
    passport.authenticate('reddit', {
        state: req.session.state,
    })(req, res, next)
}
// GET /auth/reddit/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
function loginCallback(req, res, next) {
    // Check for origin via state token
    console.log("Callback from reddit received")
    if (req.query.state == req.session.state) {
    passport.authenticate('reddit', {
        successRedirect: '/dashboard',
        failureRedirect: '/api/auth/reddit'
    })(req, res, next)
    }
    else {
       console.log(`req.query.state ${req.query.state}  req.session.state ${req.session.state}`)
       next(new Error(403));
    }
}
function logout(req, res) {
    req.logout()
    res.redirect('/')
}
