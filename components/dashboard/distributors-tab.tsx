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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

interface Distributor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export function DistributorsTab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await axios.get("/api/distributor");
        setDistributors(response.data);
      } catch (error) {
        console.error("Error fetching distributors:", error);
        toast({
          title: "Error",
          description: "Failed to load distributors",
          variant: "destructive",
        });
      }
    };

    fetchDistributors();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const distributorData = {
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      phone: formData.get("phone")?.toString() || undefined,
      address: formData.get("address")?.toString() || undefined,
    };

    try {
      const response = await axios.post("/api/distributor", distributorData);
      if (response.status === 201) {
        const newDistributor = response.data;
        setDistributors((prev) => [...prev, newDistributor]);
        toast({
          title: "Success",
          description: "Distributor created successfully",
        });
        setOpen(false);
        
      } else {
        throw new Error("Failed to create distributor");
      }
    } catch (error: any) {
      console.error("Error adding distributor:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create distributor",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/distributor", {
        data: { id },
      });

      if (response.status === 200) {
        setDistributors((prev) => prev.filter((d) => d.id !== id));
        toast({
          title: "Success",
          description: "Distributor deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting distributor:", error);
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
    const distributorData = {
      id: editingDistributor?.id,
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString(),
      phone: formData.get("phone")?.toString() || undefined,
      address: formData.get("address")?.toString() || undefined,
    };

    try {
      const response = await axios.put("/api/distributor", distributorData);
      setDistributors((prev) =>
        prev.map((d) => (d.id === response.data.id ? response.data : d))
      );
      toast({
        title: "Success",
        description: "Distributor updated successfully",
      });
      setOpen(false);
      setEditingDistributor(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update distributor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Distributors</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>{editingDistributor ? "Edit Distributor" : "Add Distributor"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingDistributor ? "Edit Distributor" : "Add New Distributor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingDistributor ? handleUpdate : handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  defaultValue={editingDistributor?.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  defaultValue={editingDistributor?.email}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  defaultValue={editingDistributor?.phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  name="address" 
                  defaultValue={editingDistributor?.address}
                />
              </div>
              <Button type="submit">
                {editingDistributor ? "Update Distributor" : "Create Distributor"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {distributors.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              No distributors found. Add your first distributor to get started.
            </CardContent>
          </Card>
        ) : (
          distributors.map((distributor) => (
            <Card key={distributor.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                  {distributor.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingDistributor(distributor);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(distributor.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1">
                  <p className="text-sm text-muted-foreground">
                    Email: {distributor.email}
                  </p>
                  {distributor.phone && (
                    <p className="text-sm text-muted-foreground">
                      Phone: {distributor.phone}
                    </p>
                  )}
                  {distributor.address && (
                    <p className="text-sm text-muted-foreground">
                      Address: {distributor.address}
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