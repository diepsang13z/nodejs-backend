const app = require('./src/app');

const PORT = 8000;

const server = app.listen(PORT, () => {
  console.log(`eComerce Server start on ${PORT}`);
});

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit eComerce Server`));
});
