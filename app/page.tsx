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

async function getProducts() {
  try {
    return await db.product.findMany({
      orderBy: {
        sku: 'asc'
      }
    })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return []
  }
}

export default async function Component() {
  const products = await getProducts()
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventarios</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Inventario semanal de producto terminado
          </CardTitle>
          <p className="text-muted-foreground">{currentDate}</p>
        </CardHeader>
        <CardContent>
          {/* Mobile view */}
          <div className="block md:hidden space-y-4">
            {products.map((product) => (
              <div key={product.id} className="border-b pb-4">
                <div className="font-semibold">SKU: {product.sku}</div>
                <div className="text-sm text-muted-foreground">{product.description}</div>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <Link href="/conteo" className="w-full block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Ir a conteo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}