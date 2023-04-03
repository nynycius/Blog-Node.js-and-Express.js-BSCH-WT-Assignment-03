// creating a basic express server
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // to handle login
const { engine } = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

//load config
dotenv.config({ path: './config/config.env' });

// Passport Config
require('./config/passport')(passport);

// initialize Database
connectDB();

// initialize the app
const app = express();

// Body parser < used to reetive object from forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

//Passport session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // store mongo
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder to native css
app.use(express.static(path.join(__dirname, 'public')));

//Router
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users.js'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
