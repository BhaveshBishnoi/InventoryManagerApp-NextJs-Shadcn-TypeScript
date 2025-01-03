import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight, BarChart3, Users, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight">
              Smart Inventory Management for Modern Businesses
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
              Streamline your inventory, boost efficiency, and grow your business with our comprehensive management solution.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">Everything you need to manage your inventory</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={Package}
                title="Inventory Tracking"
                description="Real-time tracking of stock levels, automated reordering, and detailed product management."
              />
              <FeatureCard
                icon={Users}
                title="Customer Management"
                description="Maintain customer relationships, track purchase history, and manage contact information."
              />
              <FeatureCard
                icon={TrendingUp}
                title="Sales Management"
                description="Record and analyze sales data, generate reports, and track revenue growth."
              />
              <FeatureCard
                icon={BarChart3}
                title="Analytics & Reports"
                description="Gain insights with detailed analytics and customizable reports for better decision-making."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
      <Icon className="mb-4 h-12 w-12 text-primary" />
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}