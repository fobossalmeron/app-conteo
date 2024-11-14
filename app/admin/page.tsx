import { Suspense } from "react";
import { db } from "@/lib/db";
import { InventoryList } from "@/components/inventory-list";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshButton } from "@/components/refresh-button";
import { NewInventoryButton } from "@/components/new-inventory-button";

async function getInventories() {
  try {
    const inventories = await db.inventory.findMany({
      include: {
        createdBy: true,
        confirmedBy: true,
        products: {
          include: {
            product: true,
            counts: {
              include: {
                countedBy: true,
              },
            },
          },
        },
      },
      orderBy: [{ status: "asc" }, { date: "desc" }],
    });

    return inventories;
  } catch (error) {
    console.error("Error fetching inventories:", error);
    return [];
  }
}

export default async function AdminPage() {
  const inventories = await getInventories();

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="space-y-1 flex justify-between w-full">
          <div className="flex items-center">
            <CardTitle className="text-2xl font-bold flex w-full justify-start gap-6">
              Lista de Inventarios
              <RefreshButton/>
            </CardTitle>
          </div>
          <div className="flex justify-end gap-2 w-full">
            <NewInventoryButton />
          </div>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            }
          >
            <InventoryList inventories={inventories} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
