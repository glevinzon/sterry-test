import mongoose, { Schema, model } from "mongoose";

export type ProductDocument = {
  _id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  price: number;
};

const productSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  name: String,
  category: String,
  brand: String,
  description: String,
  price: Number,
});

const Product =
  mongoose.models?.products ||
  model<ProductDocument>("products", productSchema);

export default Product;
