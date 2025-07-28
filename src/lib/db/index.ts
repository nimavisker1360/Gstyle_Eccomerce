import mongoose from 'mongoose'

const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  // For development, allow the app to run without MongoDB
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI not found, running in mock mode')
    return null
  }
  
  if (cached.conn) return cached.conn

  try {
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    })
    cached.conn = await cached.promise
    console.log('✅ Connected to MongoDB')
    return cached.conn
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed, running in mock mode:', error.message)
    cached.conn = null
    cached.promise = null
    return null
  }
}