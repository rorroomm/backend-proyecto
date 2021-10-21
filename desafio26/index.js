const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
//const MongoStore = require('connect-mongo');

const app = express();

const User = require('./db/model');

/* -------------- PASSPORT -------------- */
const passport = require('passport');
const bCrypt = require('bCrypt');
const LocalStrategy = require('passport-local').Strategy;

/* -------------- login check -------------- */
passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        // ver en db si existe el username
        User.findOne({ 'username' : username },
            function(err, user) {
                // If there is an error
                if(err) {
                    return done(err);
                }
                // If username does not exist on db
                if(!user) {
                    console.log(`Usuario "${username}" no encontrado`);
                    console.log('message', 'Usuario no encontrado');
                    return done(null, false);
                }
                // User exists but wrong pwrd
                if(!isValidPassword(user, password)) {
                    console.log('Contrasena no valida');
                    console.log('message', 'Invalid Password');
                    return done(null, false);
                }
                // si alles is goed
                return done(null, user);
            }
        );
    })
);

const isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
}

/* -------------- registration check -------------- */
passport.use('register', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done) {
        const findOrCreateUser = function(){
            User.findOne({'username':username}, function(err, user){
                if(err){
                    console.log(`Error en el registro: "${err}"`);
                    return done(err);
                }
                // si user ya existe
                if (user) {
                    console.log('Usuario ya existe');
                    console.log('message', 'Usuario ya existe en la base');
                    return done(null, false);
                } else {
                    // si no existe, crear el usuario
                    var newUser = new User();

                    newUser.username = username;
                    newUser.password = createHash(password);

                    newUser.save(function(err) {
                        if(err) {
                            console.log(`Error guardando el usuario: "${err}"`);
                            throw err;
                        }
                        console.log('Usuario registrado con exito');
                        return done(null, newUser);
                    });
                }
            });
        }
        process.nextTick(findOrCreateUser);
    })
)

/* -------------- crear hash para pwrd -------------- */
const createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

/* -------------- serialize + deserialize -------------- */
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user){
        done(err, user);
    });
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


/* -------------- LOGIN Y LOGOUT -------------- */

const getSessionName = req => req.session.nombre? req.session.nombre: ''

/* -------------- LOGIN -------------- */
app.get('/login', (req, res)=>{
    if(req.isAuthenticated()){
        res.render("welcome", {
            nombre: req.user.username
        })
    }
    else {
        res.sendFile(process.cwd() + '/public/login.html')
    }
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin'}), (req, res) => {
    res.redirect('/')
})

app.get('/faillogin', (req, res) => {
    res.render('login-error', {});
})

/*
app.post('/login', (req, res)=>{
    let { nombre } = req.body;
    req.session.nombre = nombre;
    res.redirect('/');
}) */

app.get('/logout', (req, res)=>{
    let nombre = req.user.username
    req.logout()
    res.render("logout", { nombre })
})

/* -------------- REGISTER -------------- */

app.get('/register', (req, res) => {
    res.sendFile(process.cwd() + '/public/register.html');
})

app.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), (req, res) => {
    res.redirect('/');
})

app.get('/failregister', (req, res) => {
    res.render('register-error', {});
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