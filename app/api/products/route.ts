import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    
    // First, let's verify we have a valid user
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json({ error: "No users found in database" }, { status: 500 });
    }

    // Use the first user's ID (for testing purposes)
    const userId = firstUser.id;

    const createdProduct = await prisma.product.create({
      data: {
        name: newProduct.name,
        description: newProduct.description,
        sku: newProduct.sku,
        price: newProduct.price,
        quantity: newProduct.quantity,
        minQuantity: newProduct.minQuantity,
        userId: userId,
      },
    });

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ 
      error: "Failed to create product",
      details: (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();

    if (!updatedProduct.id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: updatedProduct.id },
      data: {
        name: updatedProduct.name,
        description: updatedProduct.description,
        sku: updatedProduct.sku,
        price: updatedProduct.price,
        quantity: updatedProduct.quantity,
        minQuantity: updatedProduct.minQuantity,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
