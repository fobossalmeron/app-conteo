import { Suspense } from "react"
import { db } from "@/lib/db"
import { InventoryList } from "@/components/inventory-list"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
                countedBy: true
              }
            }
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { date: 'desc' }
      ]
    })
    
    console.log(`Found ${inventories.length} inventories`)
    return inventories
  } catch (error) {
    console.error('Error fetching inventories:', error)
    return []
  }
}

export default async function AdminPage() {
  const inventories = await getInventories()

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Lista de Inventarios
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: {inventories.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          }>
            <InventoryList inventories={inventories} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}