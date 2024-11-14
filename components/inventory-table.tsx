"use client"

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
import { Badge } from "@/components/ui/badge"
import { Inventory, InventoryStatus } from "@prisma/client"

interface InventoryWithRelations extends Inventory {
  createdBy: { name: string }
  confirmedBy: { name: string } | null
  products: {
    counts: {
      status: string
    }[]
  }[]
}

interface InventoryTableProps {
  inventories: InventoryWithRelations[]
}

const statusMap: Record<InventoryStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-yellow-500" },
  IN_PROGRESS: { label: "En Proceso", className: "bg-blue-500" },
  COMPLETED: { label: "Completado", className: "bg-green-500" },
  CANCELLED: { label: "Cancelado", className: "bg-red-500" }
}

export function InventoryTable({ inventories }: InventoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Creado por</TableHead>
          <TableHead>Confirmado por</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead>Conteos realizados</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventories.map((inventory) => (
          <TableRow key={inventory.id}>
            <TableCell>{inventory.name}</TableCell>
            <TableCell>
              {format(new Date(inventory.date), "PPP", { locale: es })}
            </TableCell>
            <TableCell>
              <Badge className={statusMap[inventory.status].className}>
                {statusMap[inventory.status].label}
              </Badge>
            </TableCell>
            <TableCell>{inventory.createdBy.name}</TableCell>
            <TableCell>{inventory.confirmedBy?.name || "-"}</TableCell>
            <TableCell>{inventory.products.length}</TableCell>
            <TableCell>
              {inventory.products.reduce((acc, product) => 
                acc + product.counts.length, 0
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 