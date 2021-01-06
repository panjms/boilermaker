const path = require('path');
const express = require('express');
const volleyball = require('volleyball');
const app = express();
// const db = require('./db');
const session = require('express-session');
const passport = require('passport');
module.exports = app;

// Logging middleware
app.use(volleyball);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // configure and create our database store
// const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const dbStore = new SequelizeStore({ db: db });

// // sync so that our session table gets created
// dbStore.sync();

//session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
    // store: dbStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (err) {
    done(err);
  }
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch(done);
});

// Static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  express.static(
    path.join(__dirname, '..', 'node_modules', 'font-awesome', 'css')
  )
);
app.use(
  '/fonts',
  express.static(
    path.join(__dirname, '..', 'node_modules', 'font-awesome', 'fonts')
  )
);

app.use('/api', require('./api'));

app.use((req, res, next) => {
  if (path.extname(req.path).length > 0) {
    res.status(404).end();
  } else {
    next();
  }
});

//api routes
app.use('/api', require('./api'));

// Sends our index.html (the "single page" of our SPA)
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

// Error catching endware
app.use((err, req, res, next) => {
  console.error(err, typeof next);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
