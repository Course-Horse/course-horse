import { MongoClient } from "mongodb";

const mongoConfig = {
  serverUrl: process.env.MONGO_ADDRESS,
  database: process.env.MONGO_DATABASE,
};

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
