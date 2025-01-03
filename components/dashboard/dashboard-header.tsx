"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
  user: {
    name: string; // Make name required
    email: string; // Required
  };
}

interface DashboardData {
  totalProducts: number;
  totalCustomers: number;
  totalSales: number;
  lowStockItems: number;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, customersRes, salesRes] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/customers"),
          axios.get("/api/sales")
        ]);

        const products = productsRes.data.products || productsRes.data;
        const customers = customersRes.data.customers || customersRes.data;
        const sales = salesRes.data.sales || salesRes.data;

        const totalSales = sales.reduce((sum: number, sale: any) => {
          const amount = parseFloat(sale.totalAmount);
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0);

        const lowStockItems = products.filter((product: any) => 
          typeof product.quantity === 'number' && product.quantity < 100
        ).length;

        setDashboardData({
          totalProducts: products.length,
          totalCustomers: customers.length,
          totalSales,
          lowStockItems,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{user.name ? user.name[0] : "U"}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.name || "User"}!</h2>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </header>

      {dashboardData ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dashboardData.totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalCustomers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.lowStockItems}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {dashboardData && dashboardData.lowStockItems > 0 && (
        <Card className="bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.lowStockItems}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}