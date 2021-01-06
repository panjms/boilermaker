const path = require('path');
const express = require('express');
const volleyball = require('volleyball');
const app = express();
module.exports = app;

// Logging middleware
app.use(volleyball);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

const port = process.env.PORT || 3000;

const init = async () => {
  try {
    app.listen(port, () =>
      console.log(`

          Listening on port ${port}

          http://localhost:${port}/

      `)
    );
  } catch (err) {
    console.log(`There was an error starting up!`, err);
  }
};

init();
