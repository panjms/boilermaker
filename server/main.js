const db = require('./db/database');
const app = require('./index.js');
const port = process.env.PORT || 1337;

const init = async () => {
  try {
    await db.sync();
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
