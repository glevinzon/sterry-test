import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import { dbConnect } from "@/lib/db";

// Action to read
export const GET = async () => {
  try {
    await dbConnect();

    const products = await Product.find();
    return NextResponse.json({ products });
  } catch (error) {
    console.log("🚀 ~ GET ~ error:", error);
  }
};

// Action to create
export const POST = async (req: NextRequest) => {
  const { name, category, brand, description, price } = await req.json();
  const product = new Product({ name, category, brand, description, price });

  await product.save();
  return NextResponse.json({ product });
};

// Action to delete
export const DELETE = async (req: NextRequest) => {
  const url = new URL(req.url).searchParams;
  const id = url.get("id");

  await Product.findByIdAndDelete(id);
  return NextResponse.json({});
};

// Action to update or edit
export const PUT = async (req: NextRequest) => {
  const url = new URL(req.url).searchParams;
  const id = url.get("id");
  const { name, category, brand, description, price } = await req.json();

  await Product.findByIdAndUpdate(id, {
    name,
    category,
    brand,
    description,
    price,
  });
  return NextResponse.json({});
};
