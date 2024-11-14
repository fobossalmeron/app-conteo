"use client"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Count, Inventory, Product, ProductInventory, User } from "@prisma/client"

interface InventoryWithRelations extends Inventory {
  createdBy: User
  confirmedBy: User | null
  products: (ProductInventory & {
    product: Product
    counts: (Count & {
      countedBy: User
    })[]
  })[]
}

interface InventoryDetailsProps {
  inventory: InventoryWithRelations
}

export function InventoryDetails({ inventory }: InventoryDetailsProps) {
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead className="text-right">Anaquel</TableHead>
            <TableHead className="text-right">Excedente</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Intelisis</TableHead>
            <TableHead className="text-right">Dif</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.products.map((productInventory) => {
            const latestCount = productInventory.counts[productInventory.counts.length - 1]
            const previousCounts = productInventory.counts.slice(0, -1)

            return (
              <React.Fragment key={productInventory.id}>
                <TableRow className="group">
                  <TableCell className="font-medium">
                    {productInventory.product.sku}
                  </TableCell>
                  <TableCell>{productInventory.product.description}</TableCell>
                  <TableCell className="text-right">
                    {latestCount?.shelfQuantity || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {latestCount?.surplusQuantity || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`px-2 py-1 rounded ${
                      latestCount?.difference === 0 
                        ? "bg-green-100" 
                        : "bg-red-100"
                    }`}>
                      {latestCount?.totalQuantity || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {productInventory.erpQuantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {latestCount?.difference !== 0 && (
                      <span className="text-red-500">
                        {latestCount?.difference || 0}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
                {previousCounts.map((count) => (
                  <TableRow key={`${productInventory.id}-${count.id}`} className="group bg-gray-50">
                    <TableCell className="font-medium text-sm text-muted-foreground">
                      Conteo {count.countNumber}
                    </TableCell>
                    <TableCell />
                    <TableCell className="text-right">
                      {count.shelfQuantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {count.surplusQuantity}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`px-2 py-1 rounded ${
                        count.difference === 0 
                          ? "bg-green-100" 
                          : "bg-red-100"
                      }`}>
                        {count.totalQuantity}
                      </span>
                    </TableCell>
                    <TableCell />
                    <TableCell className="text-right">
                      {count.difference !== 0 && (
                        <span className="text-red-500">
                          {count.difference}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
} 