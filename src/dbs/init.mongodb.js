'use strict';

const mongoose = require('mongoose');

const {
  db: { url },
} = require('../configs/index');

const { countConnect } = require('../helpers/check.connect');

const connectString = url;

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
      .then((_) => {
        countConnect();
        console.log(`Connected MongoDB Success`);
      })
      .catch((err) => console.log(`Error Connect!`, err));
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
