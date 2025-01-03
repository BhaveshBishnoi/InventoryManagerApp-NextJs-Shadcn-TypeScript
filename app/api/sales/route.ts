import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        product: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSale = await request.json();
    
    // First, let's verify we have a valid user
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json({ error: "No users found in database" }, { status: 500 });
    }

    const createdSale = await prisma.sale.create({
      data: {
        ...newSale,
        userId: firstUser.id,
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
    });
    
    // Update product quantity
    await prisma.product.update({
      where: { id: newSale.productId },
      data: {
        quantity: {
          decrement: newSale.quantity,
        },
      },
    });

    return NextResponse.json(createdSale, { status: 201 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json({ 
      error: "Failed to create sale",
      details: (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Sale ID is required" }, { status: 400 });
    }

    await prisma.sale.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Error deleting sale:", error);
    return NextResponse.json({ error: "Failed to delete sale" }, { status: 500 });
  }
}
