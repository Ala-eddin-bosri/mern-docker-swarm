const fs = require("fs");
const { MongoClient } = require("mongodb");

// Path to Docker Secret
const mongoUriPath = "/run/secrets/mongo_uri_secret";

// Read the secret file (MongoDB URI)
let Db;
try {
  Db = fs.readFileSync(mongoUriPath, "utf8").trim(); // Read and remove any trailing spaces
} catch (err) {
  console.error("Error reading MongoDB secret file:", err);
  process.exit(1); // Exit if the secret is missing
}

const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToMongoDB: async function (callback) {
    try {
      await client.connect();
      _db = client.db("employees");
      console.log("✅ Successfully connected to MongoDB.");
      return callback(null);
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error);
      return callback(error);
    }
  },

  getDb: function () {
    if (!_db) {
      throw new Error("Database not initialized. Call connectToMongoDB first.");
    }
    return _db;
  },
};
