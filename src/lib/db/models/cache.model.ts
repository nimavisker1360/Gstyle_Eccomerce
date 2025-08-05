import { Document, Model, model, models, Schema } from "mongoose";

export interface ICache extends Document {
  _id: string;
  query: string;
  queryType: string; // 'product', 'category', 'brand'
  results: any[];
  maxResults: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  hitCount: number;
  lastAccessed: Date;
}

const cacheSchema = new Schema<ICache>(
  {
    query: {
      type: String,
      required: true,
      index: true,
    },
    queryType: {
      type: String,
      required: true,
      enum: ["product", "category", "brand", "search"],
      index: true,
    },
    results: {
      type: Schema.Types.Mixed,
      required: true,
    },
    maxResults: {
      type: Number,
      required: true,
      default: 50,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    hitCount: {
      type: Number,
      default: 0,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
cacheSchema.index({ query: 1, queryType: 1 });
cacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cache =
  (models.Cache as Model<ICache>) || model<ICache>("Cache", cacheSchema);

export default Cache;
