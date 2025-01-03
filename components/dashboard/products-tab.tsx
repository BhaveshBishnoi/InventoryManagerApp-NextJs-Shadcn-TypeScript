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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity: number;
  minQuantity: number;
}

export function ProductsTab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      }
    };

    fetchProducts();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name")?.toString(),
      description: formData.get("description")?.toString(),
      sku: formData.get("sku")?.toString(),
      price: parseFloat(formData.get("price") as string),
      quantity: parseInt(formData.get("quantity") as string),
      minQuantity: parseInt(formData.get("minQuantity") as string),
    };

    try {
      const response = await axios.post("/api/products", productData);
      if (response.status === 201) {
        const newProduct = response.data;
        setProducts((prev) => [...prev, newProduct]);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        setOpen(false);
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create product",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productData = {
      id: editingProduct?.id,
      name: formData.get("name")?.toString(),
      description: formData.get("description")?.toString(),
      sku: formData.get("sku")?.toString(),
      price: parseFloat(formData.get("price") as string),
      quantity: parseInt(formData.get("quantity") as string),
      minQuantity: parseInt(formData.get("minQuantity") as string),
    };

    try {
      const response = await axios.put("/api/products", productData);
      setProducts((prev) =>
        prev.map((p) => (p.id === response.data.id ? response.data : p))
      );
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setOpen(false);
      setEditingProduct(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/products", {
        data: { id },
      });

      if (response.status === 200) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>{editingProduct ? "Edit Product" : "Add Product"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  defaultValue={editingProduct?.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  defaultValue={editingProduct?.description}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  name="sku" 
                  required 
                  defaultValue={editingProduct?.sku}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  required 
                  defaultValue={editingProduct?.price}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  required 
                  defaultValue={editingProduct?.quantity}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minQuantity">Minimum Quantity</Label>
                <Input 
                  id="minQuantity" 
                  name="minQuantity" 
                  type="number" 
                  required 
                  defaultValue={editingProduct?.minQuantity}
                />
              </div>
              <Button type="submit">
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              No products found. Add your first product to get started.
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                  {product.name}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingProduct(product);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1">
                  <p className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                  {product.description && (
                    <p className="text-sm text-muted-foreground">
                      Description: {product.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Price: ₹{product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {product.quantity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Min Quantity: {product.minQuantity}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}