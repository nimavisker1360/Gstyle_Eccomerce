import { Document, Model, model, models, Schema } from "mongoose";

// Interface برای محصول Google Shopping
interface IGoogleShoppingProduct {
  id: string;
  title: string;
  originalTitle: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  description: string;
  link: string;
  googleShoppingLink: string;
  source: string;
  rating: number;
  reviews: number;
  delivery: string;
  position: number;
  product_id: string;
}

// Interface برای سند homepageproducts
export interface IHomepageProducts extends Document {
  _id: string;
  products: IGoogleShoppingProduct[];
  lastRefresh: Date;
  nextRefresh: Date;
  refreshIntervalHours: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema برای محصول Google Shopping
const googleShoppingProductSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  originalTitle: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  currency: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, default: "" },
  googleShoppingLink: { type: String, default: "" },
  source: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  delivery: { type: String, required: true },
  position: { type: Number, required: true },
  product_id: { type: String, required: true }
});

// Schema اصلی برای کالکشن homepageproducts
const homepageProductsSchema = new Schema<IHomepageProducts>(
  {
    products: [googleShoppingProductSchema],
    lastRefresh: { type: Date, required: true },
    nextRefresh: { type: Date, required: true },
    refreshIntervalHours: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  {
    timestamps: true,
  }
);

const HomepageProducts =
  (models.HomepageProducts as Model<IHomepageProducts>) ||
  model<IHomepageProducts>("HomepageProducts", homepageProductsSchema, "homepageproducts");

export default HomepageProducts;