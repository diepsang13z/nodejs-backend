'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of Connection:: ${numConnection}`);
};

const checkOverload = () => {
  const _SECONDS = 5000;

  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Active connection:: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 2024 / 2024} MB`);

    const maxConnections = numCores * 5; // Maximun number of connections based on number of cores
    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
