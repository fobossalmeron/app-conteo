import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryDetails } from "@/components/inventory-details"

interface PageProps {
  params: {
    id: string
  }
}

async function getInventory(inventoryId: string) {
  try {
    const id = parseInt(inventoryId)
    
    if (isNaN(id)) {
      return notFound()
    }

    const inventory = await db.inventory.findUnique({
      where: { id },
      include: {
        createdBy: true,
        confirmedBy: true,
        products: {
          include: {
            product: true,
            counts: {
              include: {
                countedBy: true
              },
              orderBy: {
                countNumber: 'asc'
              }
            }
          }
        }
      }
    })

    if (!inventory) {
      return notFound()
    }

    return inventory
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return notFound()
  }
}

export default async function InventoryPage({ params }: PageProps) {
  if (!params?.id) {
    return notFound()
  }

  const inventory = await getInventory(params.id)

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="space-y-1">
        <div className="text-sm text-muted-foreground">Inventario</div>
          <CardTitle className="text-2xl font-bold">
            {inventory.name}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(new Date(inventory.date), "PPP", { locale: es })}
          </div>
        </CardHeader>
        <CardContent>
          <InventoryDetails inventory={inventory} />
        </CardContent>
      </Card>
    </div>
  )
} 