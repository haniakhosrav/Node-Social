const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const debug = require('debug')('blog-deb');

const path = require('path');

const connectDB = require('./config/db');
const Winston = require('./config/winston');

//? Load Config
dotEnv.config({path: './config/config.env'});

const app = express();

//? Logging
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('combined', {stream: Winston.stream}));
}

//? Connect to database
connectDB();
debug('connected to database');

//? PassPort Configration
require('./config/passport');

//? Custom MiddleWares 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI})
}));
app.use(flash());

//? passport
app.use(passport.initialize());
app.use(passport.session());

//? View Engine
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set('layout', './layouts/mainLayout');
app.use(expressLayouts);

//? Statics
app.use(express.static(path.join(__dirname, 'public')));

//? Routes
app.use('/', require('./routes/blog'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/users', require('./routes/users'));
app.use(require('./controllers/errorController').get404);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));