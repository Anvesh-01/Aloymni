import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable in your .env file');
}

interface MongooseConn {
  conn: mongoose.Connection | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseConn | undefined;
}

let cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

// const dbConnect = async (): Promise<mongoose.Connection> => {
//   // Return existing connection if available and ready
//   if (cached.conn && cached.conn.readyState === 1) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       dbName: process.env.DB_NAME || 'Alumni',
//       bufferCommands: false,
//       connectTimeoutMS: 30000,
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts);
//   }

//   try {
//     const mongooseInstance = await cached.promise;
//     cached.conn = mongooseInstance.connection;
    
//     // Wait for the connection to be ready
//     if (cached.conn.readyState !== 1) {
//       await new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => reject(new Error('Connection timeout')), 100000);
//         cached.conn!.once('open', () => {
//           clearTimeout(timeout);
//           resolve(true);
//         });
//         cached.conn!.once('error', (err) => {
//           clearTimeout(timeout);
//           reject(err);
//         });
//       });
//     }
    
//     console.log('✅ MongoDB connected successfully');
//     return cached.conn;
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error);
//     cached.promise = null; // Reset promise on error
//     cached.conn = null;
//     throw error;
//   }
// };

// export default dbConnect;


export async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      dbName: process.env.DB_NAME || "Alumni",
      bufferCommands: false,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      autoIndex: process.env.NODE_ENV !== "production",
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts);
  }

  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;

  return cached.conn;
}