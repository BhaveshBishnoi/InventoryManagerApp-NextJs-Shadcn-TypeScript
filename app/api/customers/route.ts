import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient();

// Handle CRUD operations
export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newCustomer = await request.json();
    console.log("Received customer data:", newCustomer);

    // First, let's verify we have a valid user
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json({ error: "No users found in database" }, { status: 500 });
    }

    // Use the first user's ID (for testing purposes)
    const userId = firstUser.id;
    console.log("Using userId:", userId);

    const createdCustomer = await prisma.customer.create({
      data: {
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone || null,
        address: newCustomer.address || null,
        userId: userId,
      },
    });

    console.log("Created customer:", createdCustomer);
    return NextResponse.json(createdCustomer, { status: 201 });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json({ 
      error: "Failed to create customer", 
      details: (error as Error).message,
      stack: (error as Error).stack 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedCustomer = await request.json();

    // Validate incoming data
    if (!updatedCustomer.id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    const customer = await prisma.customer.update({
      where: { id: updatedCustomer.id },
      data: {
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        address: updatedCustomer.address,
      },
    });
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed to update customer", details: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Customer ID is required" }, { status: 400 });
    }

    await prisma.customer.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer", details: (error as Error).message }, { status: 500 });
  }
}
