import mongoose from 'mongoose'

const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
) => {
  if (cached.conn) return cached.conn

  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing')

  // بهینه‌سازی تنظیمات MongoDB برای سرعت بالا
  const options = {
    maxPoolSize: 10, // حداکثر 10 اتصال همزمان
    serverSelectionTimeoutMS: 5000, // 5 ثانیه انتظار برای سرور
    socketTimeoutMS: 45000, // 45 ثانیه timeout برای socket
    bufferCommands: false, // غیرفعال کردن buffer commands
    maxIdleTimeMS: 30000, // بستن اتصالات idle
    connectTimeoutMS: 10000, // 10 ثانیه timeout برای اتصال
  }

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, options)

  try {
    cached.conn = await cached.promise
    console.log('✅ MongoDB connected with optimized settings')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    cached.promise = null
    throw error
  }

  return cached.conn
}