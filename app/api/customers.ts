import { NextApiRequest, NextApiResponse } from 'next';

// Define a Customer interface
interface Customer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
      try {
        const { name, email, phone, address } = req.body;
  
        if (!name || !email) {
          return res.status(400).json({ message: "Name and email are required" });
        }
  
        // Example: Save customer to the database (replace with your logic)
        const newCustomer = { id: Date.now(), name, email, phone, address };
        console.log("New Customer:", newCustomer);
  
        return res.status(201).json({ message: "Customer created successfully", customer: newCustomer });
      } catch (error) {
        console.error("Error creating customer:", error);
        return res.status(500).json({ message: "Internal server error", details: (error as Error).message });
      }
    } else if (req.method === "GET") {
        // Fetch all customers (replace with your logic)
        const customers: Customer[] = []; // Explicitly define the type
        return res.status(200).json(customers);
    } else if (req.method === "PUT") {
        const { id, name, email, phone, address } = req.body;

        if (!id || !name || !email) {
            return res.status(400).json({ message: "ID, name, and email are required" });
        }

        try {
            // Example: Update customer in the database (replace with your logic)
            const updatedCustomer = { id, name, email, phone, address };
            console.log("Updated Customer:", updatedCustomer);

            return res.status(200).json({ message: "Customer updated successfully", customer: updatedCustomer });
        } catch (error) {
            console.error("Error updating customer:", error);
            return res.status(500).json({ message: "Internal server error", details: (error as Error).message });
        }
    } else if (req.method === "DELETE") {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        try {
            // Example: Delete customer from the database (replace with your logic)
            console.log("Deleted Customer ID:", id);

            return res.status(200).json({ message: "Customer deleted successfully" });
        } catch (error) {
            console.error("Error deleting customer:", error);
            return res.status(500).json({ message: "Internal server error", details: (error as Error).message });
        }
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
} 