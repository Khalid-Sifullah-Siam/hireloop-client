const { loadEnvConfig } = require("@next/env");
const { MongoClient } = require("mongodb");

loadEnvConfig(process.cwd());

async function checkData() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  const databaseName = (process.env.DATABASE_NAME || "hireloop").trim();
  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  const database = client.db(databaseName);
  const expectedCollections = [
    "jobs",
    "companies",
    "applications",
    "savedJobs",
    "plansCollection",
    "user",
  ];
  const existingCollections = await database.listCollections().toArray();
  const existingNames = new Set(existingCollections.map((item) => item.name));

  console.log(`Database: ${database.databaseName}`);

  for (const collectionName of expectedCollections) {
    if (!existingNames.has(collectionName)) {
      throw new Error(`Missing collection: ${collectionName}`);
    }

    const count = await database.collection(collectionName).countDocuments();
    console.log(`${collectionName}: ${count}`);
  }

  const publicJobs = await database.collection("jobs").countDocuments({
    status: { $regex: /^(approved|active)$/i },
  });
  const pendingJobs = await database.collection("jobs").countDocuments({
    status: { $regex: /^pending$/i },
  });
  const publicCompanies = await database.collection("companies").countDocuments({
    status: { $regex: /^(approved|active)$/i },
  });
  const pendingUsers = await database.collection("user").countDocuments({
    status: { $regex: /^pending$/i },
  });

  console.log(`public jobs: ${publicJobs}`);
  console.log(`pending jobs for admin: ${pendingJobs}`);
  console.log(`public companies: ${publicCompanies}`);
  console.log(`pending users for admin: ${pendingUsers}`);
  console.log("Data check passed.");

  await client.close();
}

checkData().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
