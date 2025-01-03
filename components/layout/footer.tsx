import { PackageSearch } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <PackageSearch className="h-6 w-6" />
            <span className="font-bold">InventoryPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 InventoryPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}