require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function migrate() {
  const localUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/pery_sport';
  const atlasUri = process.env.MONGODB_URI;

  if (!atlasUri) {
    throw new Error('Vui long cau hinh MONGODB_URI trong file .env.local truoc khi chay migrate!');
  }

  console.log('Connecting to local MongoDB...');
  const localConn = await mongoose.createConnection(localUri).asPromise();
  console.log('Connected to local MongoDB.');

  console.log('Connecting to Atlas MongoDB...');
  const atlasConn = await mongoose.createConnection(atlasUri).asPromise();
  console.log('Connected to Atlas MongoDB.');

  const collections = await localConn.db.listCollections().toArray();
  console.log('Collections to sync:', collections.map(c => c.name));

  for (const col of collections) {
    const colName = col.name;
    const localCol = localConn.db.collection(colName);
    const atlasCol = atlasConn.db.collection(colName);

    const docs = await localCol.find({}).toArray();
    console.log(`Syncing ${colName} (${docs.length} documents)...`);

    // Clean Atlas collection to avoid duplicates from previous seed runs
    await atlasCol.deleteMany({});

    if (docs.length > 0) {
      await atlasCol.insertMany(docs);
      console.log(`  -> Inserted ${docs.length} documents into Atlas ${colName}`);
    }
  }

  console.log('\n--- Final Verification of Atlas Collections ---');
  for (const col of collections) {
    const count = await atlasConn.db.collection(col.name).countDocuments();
    console.log(`  ${col.name}: ${count} documents`);
  }

  await localConn.close();
  await atlasConn.close();
  console.log('\n✅ Data successfully migrated 1:1 from Local MongoDB to Atlas!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
