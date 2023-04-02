// creating a basic express server
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); // to handle login
const { engine } = require('express-handlebars');
const connectDB = require('./config/db');

//load config
dotenv.config({ path: './config/config.env' });

connectDB();

// initialize the app
const app = express();

// logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

//Router

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Sever running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
