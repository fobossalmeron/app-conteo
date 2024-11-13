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

interface InventoryItem {
  sku: string
  description: string
}

const inventoryItems: InventoryItem[] = [
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
  },
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
  },
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
  },
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
  },
]

export default function Component() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Inventarios</h1>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Inventario semanal de producto terminado
          </CardTitle>
          <p className="text-muted-foreground">10 de octubre 2024</p>
        </CardHeader>
        <CardContent>
          {/* Mobile view */}
          <div className="block md:hidden space-y-4">
            {inventoryItems.map((item, index) => (
              <div key={index} className="border-b pb-4">
                <div className="font-semibold">SKU: {item.sku}</div>
                <div className="text-sm text-muted-foreground">{item.description}</div>
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
                {inventoryItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.description}</TableCell>
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