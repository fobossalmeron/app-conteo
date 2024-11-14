"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InventoryWithRelations extends Inventory {
  id: number
  createdBy: { name: string }
  confirmedBy: { name: string } | null
  products: {
    counts: {
      status: string
    }[]
  }[]
}

interface InventoryListProps {
  inventories: InventoryWithRelations[]
}

const statusMap: Record<InventoryStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendiente", className: "bg-yellow-500" },
  IN_PROGRESS: { label: "En Proceso", className: "bg-blue-500" },
  COMPLETED: { label: "Completado", className: "bg-green-500" },
  CANCELLED: { label: "Cancelado", className: "bg-red-500" }
}

export function InventoryList({ inventories }: InventoryListProps) {
  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este inventario?")) return
    
    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al eliminar el inventario")
      }
      
      window.location.reload()
    } catch (error) {
      console.error("Error:", error)
      alert("No se pudo eliminar el inventario")
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Fecha de creación</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead>Conteos</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventories.map((inventory) => (
          <TableRow 
            key={inventory.id} 
            className="hover:bg-muted/50 transition-colors"
          >
            <TableCell>
              <Link 
                href={`/admin/inventario/${inventory.id}`}
                className="block w-full cursor-pointer"
              >
                {inventory.name}
              </Link>
            </TableCell>
            <TableCell>
              <Link 
                href={`/admin/inventario/${inventory.id}`}
                className="block w-full cursor-pointer"
              >
                {format(new Date(inventory.date), "PPP", { locale: es })}
              </Link>
            </TableCell>
            <TableCell>
              <Link 
                href={`/admin/inventario/${inventory.id}`}
                className="block w-full cursor-pointer"
              >
                <Badge className={statusMap[inventory.status].className}>
                  {statusMap[inventory.status].label}
                </Badge>
              </Link>
            </TableCell>
            <TableCell>
              <Link 
                href={`/admin/inventario/${inventory.id}`}
                className="block w-full cursor-pointer"
              >
                {inventory.products.length}
              </Link>
            </TableCell>
            <TableCell>
              <Link 
                href={`/admin/inventario/${inventory.id}`}
                className="block w-full cursor-pointer"
              >
                {inventory.products.reduce((acc, product) => 
                  acc + product.counts.length, 0
                )}
              </Link>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDelete(inventory.id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 