"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductsTab } from "@/components/dashboard/products-tab";
import { CustomersTab } from "@/components/dashboard/customers-tab";
import { DistributorsTab } from "@/components/dashboard/distributors-tab";
import { SalesTab } from "@/components/dashboard/sales-tab";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <DashboardHeader user={session.user} />

      <Tabs defaultValue="products" className="mt-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="distributors">Distributors</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>
        <TabsContent value="customers">
          <CustomersTab />
        </TabsContent>
        <TabsContent value="distributors">
          <DistributorsTab />
        </TabsContent>
        <TabsContent value="sales">
          <SalesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}