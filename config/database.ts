import { connect, set } from 'mongoose';

const connectDB = async () => {
  const connection = { isEstablished: false };
  set('strictQuery', true);
  // If the database is already connected, don't connect again
  if (connection.isEstablished) {
    console.warn('MongoDB is already connected.');
    return;
  }
  // Connect to MongoDB
  await connect(process.env.MONGODB_URI as string);
  connection.isEstablished = true;
  console.log('MongoDB connected.');
};

export default connectDB;
