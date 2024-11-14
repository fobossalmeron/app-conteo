import { db } from '@/lib/db'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

async function getInventories() {
  try {
    return await db.inventory.findMany({
      where: {
        status: {
          in: ["PENDING", "IN_PROGRESS"]
        }
      },
      include: {
        products: {
          include: {
            product: true,
            counts: {
              orderBy: {
                countNumber: 'desc'
              },
              take: 1
            }
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { date: 'desc' }
      ]
    })
  } catch (error) {
    console.error('Error al obtener inventarios:', error)
    return []
  }
}

export default async function HomePage() {
  const inventories = await getInventories()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventarios</h1>
      
      {inventories.map((inventory) => {
        // Determinar el siguiente número de conteo
        const maxCountNumber = Math.max(
          0,
          ...inventory.products
            .map(p => p.counts[0]?.countNumber ?? 0)
        )
        const nextCountNumber = maxCountNumber + 1

        return (
          <Card key={inventory.id} className="w-full mb-4">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold">
                {inventory.name}
              </CardTitle>
              <p className="text-muted-foreground">
                {format(new Date(inventory.date), "PPP", { locale: es })}
              </p>
            </CardHeader>
            <CardContent>
              {/* Mobile view */}
              <div className="block md:hidden space-y-4">
                {inventory.products.map((productInventory) => (
                  <div key={productInventory.id} className="border-b pb-4">
                    <div className="font-semibold">SKU: {productInventory.product.sku}</div>
                    <div className="text-sm text-muted-foreground">
                      {productInventory.product.description}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop view */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead className="text-right">Conteos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventory.products.map((productInventory) => (
                      <TableRow key={productInventory.id}>
                        <TableCell>{productInventory.product.sku}</TableCell>
                        <TableCell>{productInventory.product.description}</TableCell>
                        <TableCell className="text-right">
                          {productInventory.counts.length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <Link 
                  href={`/inventario/${inventory.id}/conteo`}
                  className="w-full block"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Ir a conteo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}