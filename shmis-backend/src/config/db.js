const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI .env file mein set nahi hai');
  }

  mongoose.connection.on('connected', () =>
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`)
  );
  mongoose.connection.on('error', (err) =>
    console.error('❌ MongoDB error:', err.message)
  );
  mongoose.connection.on('disconnected', () =>
    console.warn('⚠️  MongoDB disconnected')
  );

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
};

module.exports = connectDB;
