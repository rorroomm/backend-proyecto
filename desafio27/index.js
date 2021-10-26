const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');

const app = express();

const User = require('./db/model');

/* -------------- PASSPORT w FACEBOOK -------------- */
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

/* -------------- login FB -------------- */
const FACEBOOK_APP_ID = '1220200111800126';
const FACEBOOK_APP_SECRET = 'c39a2a1a757ce49f38c9eb1422b04301';


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID, 
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    scope: ['email']
}, function(accessToken, refreshToken, profile, done) {
    let userProfile = profile;

    return done(null, userProfile);
}));

/* -------------- serialize + deserialize -------------- */
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

/* ------------------------------------ */

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 60000
    }
}));


app.engine(
    "hbs", 
    handlebars({
        extname: ".hbs",
        defaultLayout: 'index.hbs',
    })
);


app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());


/* -------------- LOGIN Y LOGOUT c/ FB-------------- */

/* -------------- LOGIN -------------- */
app.get('/login', (req, res)=>{
    if(req.isAuthenticated()){
        res.render("welcome", {
            nombre: req.user.displayName,
            foto: req.user.photos[0].value,
            email: req.user.emails[0].value,
            contador: req.user.contador
        })
    }
    else {
        res.sendFile(process.cwd() + '/public/login.html')
    }
})

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook',
    {
        successRedirect: '/welcome',
        failureRedirect: '/faillogin'
    }
));

app.get('/welcome', (req, res) => {
    res.redirect('/');
});

app.get('/faillogin', (req, res) => {
    res.render('login-error', {});
})

app.get('/logout', (req, res)=>{
    let nombre = req.user.displayName;
    req.logout();
    res.render("logout", { nombre })
})

/* -------------- DB CONNECTION -------------- */

app.listen(3040, ()=>{
    console.log('Running - 4 ended up 3rd');
    mongoose.connect('mongodb://localhost:27017/ecommerce', 
        {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        }
    )
        .then( () => console.log('Base de datos conectada') )
        .catch( (err) => console.log(error) );
})
