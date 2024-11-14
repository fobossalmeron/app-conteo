import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InventoryDetails } from "@/components/inventory-details";
import { RefreshButton } from "@/components/refresh-button";

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function InventoryPage({ params }: PageProps) {
  const { id } = await params;
  
  const inventory = await db.inventory.findUnique({
    where: { 
      id: +id
    },
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
            orderBy: {
              countNumber: "asc",
            },
          },
        },
      },
    },
  });

  if (!inventory) {
    return notFound();
  }

  return (
    <div className="container mx-auto p-6 relative gap-4">
      <Link href="/admin">
        <Button variant="outline" className="flex items-center gap-2 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Volver a inventarios
        </Button>
      </Link>
      <div className="">
        <Card>
          <CardHeader className="space-y-1">
            <div className="text-sm text-muted-foreground">Inventario</div>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold flex items-center gap-6">
                {inventory.name}
                <RefreshButton />
              </CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(inventory.date), "PPP", { locale: es })}
            </div>
          </CardHeader>
          <CardContent>
            <InventoryDetails inventory={inventory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
