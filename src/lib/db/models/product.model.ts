import { Document, Model, model, models, Schema } from "mongoose";
import { IProductInput } from "@/types";

export interface IProduct extends Document, IProductInput {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: [String],
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    listPrice: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    tags: { type: [String], default: ["new arrival"] },
    colors: { type: [String], default: ["White", "Red", "Black"] },
    sizes: { type: [String], default: ["S", "M", "L"] },
    avgRating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    ratingDistribution: [
      {
        rating: {
          type: Number,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    numSales: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// اضافه کردن Index‌های بهینه برای جستجوی سریع
productSchema.index({ category: 1 }); // جستجو بر اساس دسته‌بندی
productSchema.index({ brand: 1 }); // جستجو بر اساس برند
productSchema.index({ price: 1 }); // مرتب‌سازی بر اساس قیمت
productSchema.index({ avgRating: -1 }); // مرتب‌سازی بر اساس امتیاز
productSchema.index({ numSales: -1 }); // مرتب‌سازی بر اساس فروش
productSchema.index({ createdAt: -1 }); // مرتب‌سازی بر اساس تاریخ
productSchema.index({ isPublished: 1 }); // فیلتر محصولات منتشر شده

// Index‌های ترکیبی برای کوئری‌های پیچیده
productSchema.index({ category: 1, isPublished: 1 }); 
productSchema.index({ category: 1, price: 1 }); 
productSchema.index({ brand: 1, category: 1 }); 
productSchema.index({ isPublished: 1, avgRating: -1 }); 

// Text index برای جستجوی متنی سریع
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text',
  category: 'text' 
}, {
  weights: {
    name: 10,
    brand: 5,
    category: 3,
    description: 1
  }
});

const Product =
  (models.Product as Model<IProduct>) ||
  model<IProduct>("Product", productSchema);

export default Product;
