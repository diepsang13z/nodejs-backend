'use strict';

const mongoose = require('mongoose');

require('dotenv').config();

const connectString = 'mongodb://localhost:27017/shopDEV';

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('Mongoose Connection', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  it('Should connect to mongoose', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  const nameForTest = 'diepsang';

  it('Should save a document to the database', async () => {
    const user = new Test({ name: nameForTest });
    await user.save();
    expect(user.isNew).toBe(false);
  });

  it('Should find a document to the database', async () => {
    const user = await Test.findOne({ name: nameForTest });
    expect(user).toBeDefined();
    expect(user.name).toBe(nameForTest);
  });
});
