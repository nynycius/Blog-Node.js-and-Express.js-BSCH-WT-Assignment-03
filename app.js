// creating a basic express server
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // to handle login
const { engine } = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


// Method overrride to handle upadate method
const methodOverride = require('method-override')

// handlebars Helpers
const { formatDate, editIcon, truncate } = require('./helpers/hbs')

// middleware to be used in tthe nav-bar permissions
const { ensureAuth, ensureGuest, ensureAdm } = require('./middleware/auth');

// to store credentions on sessions 
const MongoStore = require('connect-mongo');

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

// method Override function
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Handlebars
app.engine(
  '.hbs', 
  engine({
    helpers: {
      formatDate,
      truncate,
      editIcon,
  },
   defaultLayout: 'main', 
   extname: '.hbs',
  })
);
app.set('view engine', '.hbs');
app.set('views', './views');

//Passport session
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Connect flash and set Global variables
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
});


//Cookies
app.use(cookieParser());

// Static folder to native css
app.use(express.static(path.join(__dirname, 'public')));

//Router
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/adm', require('./routes/adm'));
app.use('/blogPost', require('./routes/blogPost'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
