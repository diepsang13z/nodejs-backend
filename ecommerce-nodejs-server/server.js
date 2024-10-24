'use strict';

const app = require('./src/app');
const {
  app: { port },
} = require('./src/configs/index');

const PORT = port;

const server = app.listen(PORT, () => {
  console.log(`eComerce Server start on ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit eComerce Server`));
});
