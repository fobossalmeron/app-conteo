"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Inventory, InventoryStatus, Product, ProductInventory, Count } from "@prisma/client"

interface InventoryWithRelations extends Inventory {
  createdBy: { name: string }
  confirmedBy: { name: string } | null
  products: (ProductInventory & {
    product: Product
    counts: Count[]
  })[]
}

interface InventoryListProps {
  inventories: InventoryWithRelations[]
}

const statusStyles: Record<InventoryStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800"
}

const statusLabels: Record<InventoryStatus, string> = {
  PENDING: "Pendiente",
  IN_PROGRESS: "En Proceso",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado"
}

export function InventoryList({ inventories }: InventoryListProps) {
  const router = useRouter()

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado por</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead className="text-right">Conteos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventories.map((inventory) => (
            <TableRow 
              key={inventory.id} 
              className="group hover:bg-muted/50 cursor-pointer"
              onClick={() => router.push(`/admin/inventario/${inventory.id}`)}
            >
              <TableCell className="font-medium">{inventory.name}</TableCell>
              <TableCell>
                {format(new Date(inventory.date), "PPP", { locale: es })}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[inventory.status]}`}>
                  {statusLabels[inventory.status]}
                </span>
              </TableCell>
              <TableCell>{inventory.createdBy.name}</TableCell>
              <TableCell>{inventory.products.length}</TableCell>
              <TableCell className="text-right">
                {inventory.products.reduce((acc, product) => 
                  acc + product.counts.length, 0
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 