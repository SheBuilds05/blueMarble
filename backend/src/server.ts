import mongoose from 'mongoose';

import dotenv from 'dotenv';

 

dotenv.config();

 

function getMongoURI(): string {

  const uri = process.env.MONGODB_URI;

  if (!uri) {

    throw new Error('❌ MONGODB_URI is not defined in .env file');

  }

  return uri;

}

 

async function testDatabaseConnection() {

  try {

    const MONGODB_URI = getMongoURI();

    console.log('🔄 Attempting to connect to MongoDB...');

    const maskedUri = MONGODB_URI.replace(/\/\/(.*)@/, '//***:***@');

    console.log(`📡 Connection string: ${maskedUri}`);

 

    await mongoose.connect(MONGODB_URI);

    console.log('✅ Successfully connected to MongoDB!');

 

    if (mongoose.connection.db) {

      const collections = await mongoose.connection.db.listCollections().toArray();

      console.log(`📚 Collections: ${collections.map(c => c.name).join(', ') || 'none'}`);

    }

 

    await mongoose.disconnect();

    console.log('🔌 Connection closed.');

    process.exit(0);

  } catch (error) {

    console.error('❌ Failed:', error);

    process.exit(1);

  }

}

 

testDatabaseConnection();


