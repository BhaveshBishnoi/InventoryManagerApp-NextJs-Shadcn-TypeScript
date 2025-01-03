import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const distributors = await prisma.distributor.findMany();
    return NextResponse.json(distributors);
  } catch (error) {
    console.error("Error fetching distributors:", error);
    return NextResponse.json({ error: "Failed to fetch distributors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newDistributor = await request.json();
    console.log("Received distributor data:", newDistributor);

    // First, let's verify we have a valid user
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json({ error: "No users found in database" }, { status: 500 });
    }

    // Use the first user's ID (for testing purposes)
    const userId = firstUser.id;
    console.log("Using userId:", userId);

    const createdDistributor = await prisma.distributor.create({
      data: {
        name: newDistributor.name,
        email: newDistributor.email,
        phone: newDistributor.phone || null,
        address: newDistributor.address || null,
        userId: userId,
      },
    });

    console.log("Created distributor:", createdDistributor);
    return NextResponse.json(createdDistributor, { status: 201 });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json({ 
      error: "Failed to create distributor", 
      details: (error as Error).message,
      stack: (error as Error).stack 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedDistributor = await request.json();

    if (!updatedDistributor.id) {
      return NextResponse.json({ error: "Distributor ID is required" }, { status: 400 });
    }

    const distributor = await prisma.distributor.update({
      where: { id: updatedDistributor.id },
      data: {
        name: updatedDistributor.name,
        email: updatedDistributor.email,
        phone: updatedDistributor.phone,
        address: updatedDistributor.address,
      },
    });
    return NextResponse.json(distributor);
  } catch (error) {
    console.error("Error updating distributor:", error);
    return NextResponse.json({ error: "Failed to update distributor", details: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Distributor ID is required" }, { status: 400 });
    }

    await prisma.distributor.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Distributor deleted successfully" });
  } catch (error) {
    console.error("Error deleting distributor:", error);
    return NextResponse.json({ error: "Failed to delete distributor", details: (error as Error).message }, { status: 500 });
  }
}
