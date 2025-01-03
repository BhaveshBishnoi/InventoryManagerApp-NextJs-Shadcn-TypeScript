"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

// Define a Customer interface
interface Customer {
  id: string; // Adjust the type based on your database schema
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export function CustomersTab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customerData = {
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      phone: formData.get("phone")?.toString() || undefined,
      address: formData.get("address")?.toString() || undefined,
    };

    try {
      const response = await axios.post("/api/customers", customerData);
      if (response.status === 201) {
        const newCustomer = response.data;
        setCustomers((prev) => [...prev, newCustomer]);
        toast({
          title: "Success",
          description: "Customer created successfully",
        });
        setOpen(false);
      } else {
        throw new Error("Failed to create customer");
      }
    } catch (error: any) {
      console.error("Error adding customer:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create customer",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/customers", {
        data: { id },
      });

      if (response.status === 200) {
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
        toast({
          title: "Success",
          description: "Customer deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const customerData = {
      id: editingCustomer?.id,
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      phone: formData.get("phone")?.toString() || undefined,
      address: formData.get("address")?.toString() || undefined,
    };

    try {
      const response = await axios.put("/api/customers", customerData);
      setCustomers((prev) =>
        prev.map((c) => (c.id === response.data.id ? response.data : c))
      );
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      setOpen(false);
      setEditingCustomer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>{editingCustomer ? "Edit Customer" : "Add Customer"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingCustomer ? handleUpdate : handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  defaultValue={editingCustomer?.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  defaultValue={editingCustomer?.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  defaultValue={editingCustomer?.phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  defaultValue={editingCustomer?.address}
                />
              </div>
              <Button type="submit">
                {editingCustomer ? "Update Customer" : "Create Customer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {customers.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              No customers found. Add your first customer to get started.
            </CardContent>
          </Card>
        ) : (
          customers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                  {customer.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingCustomer(customer);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(customer.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1">
                  <p className="text-sm text-muted-foreground">
                    Email: {customer.email}
                  </p>
                  {customer.phone && (
                    <p className="text-sm text-muted-foreground">
                      Phone: {customer.phone}
                    </p>
                  )}
                  {customer.address && (
                    <p className="text-sm text-muted-foreground">
                      Address: {customer.address}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
