const express = require('express');
const PORT = 3000;
const server = require('./index');
const { db } = require('./db');
const app = express();
const router = require('./api');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//should use index by default
app.use('/api', router);

const init = async () => {
  try {
    // await db.sync();
    server.listen(PORT, () =>
      console.log(`

          Listening on port ${PORT}

          http://localhost:${PORT}/

      `)
    );
  } catch (err) {
    console.log(`There was an error starting up!`, err);
  }
};

init();
