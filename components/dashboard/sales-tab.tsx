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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  price: number;
}

interface Customer {
  id: string;
  name: string;
}

interface Sale {
  id: string;
  productId: string;
  product: Product;
  customerId: string;
  customer: Customer;
  quantity: number;
  totalAmount: number;
  createdAt: string;
}

export function SalesTab() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, productsRes, customersRes] = await Promise.all([
          axios.get("/api/sales"),
          axios.get("/api/products"),
          axios.get("/api/customers"),
        ]);
        setSales(salesRes.data);
        setProducts(productsRes.data);
        setCustomers(customersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // Calculate total amount based on selected product and quantity
  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        const total = product.price * quantity;
        const totalInput = document.getElementById("totalAmount") as HTMLInputElement;
        if (totalInput) {
          totalInput.value = total.toFixed(2);
        }
      }
    }
  }, [selectedProduct, quantity, products]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const saleData = {
      productId: formData.get("productId")?.toString(),
      customerId: formData.get("customerId")?.toString(),
      quantity: parseInt(formData.get("quantity") as string),
      totalAmount: parseFloat(formData.get("totalAmount") as string),
    };
    
    try {
      const response = await axios.post("/api/sales", saleData);
      if (response.status === 201) {
        setSales((prev) => [...prev, response.data]);
        toast({
          title: "Success",
          description: "Sale recorded successfully",
        });
        setOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to record sale",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/sales", {
        data: { id },
      });
      if (response.status === 200) {
        setSales((prev) => prev.filter((sale) => sale.id !== id));
        toast({
          title: "Success",
          description: "Sale deleted successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete sale",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Record Sale</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <Select 
                  name="productId" 
                  required
                  onValueChange={(value) => setSelectedProduct(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ₹{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <Select name="customerId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  min="1"
                  required 
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input 
                  id="totalAmount" 
                  name="totalAmount" 
                  type="number" 
                  step="0.01" 
                  required 
                  readOnly
                />
              </div>
              <Button type="submit">Record Sale</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sales.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              No sales found. Record your first sale to get started.
            </CardContent>
          </Card>
        ) : (
          sales.map((sale) => (
            <Card key={sale.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">
                  Sale #{sale.id.slice(-4)}
                </CardTitle>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(sale.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-1">
                  <p className="text-sm text-muted-foreground">
                    Product: {sale.product.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Customer: {sale.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {sale.quantity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Amount: ₹{sale.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(sale.createdAt).toLocaleDateString()}
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