'use strict';

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect');

const connectString = `mongodb://localhost:27017/shopDEV`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') {
    const DEBUG = 1;

    if (DEBUG == 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connected MongoDB Success`, countConnect()))
      .catch((err) => console.log(`Error Connect!`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;
