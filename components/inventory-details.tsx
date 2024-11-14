"use client"
import React, { useEffect } from "react"
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
  // Verificar si todos los productos tienen conteos exitosos
  const allProductsCorrect = inventory.products.every((productInventory) => {
    // Obtener el último conteo de cada producto
    const lastCount = [...productInventory.counts]
      .sort((a, b) => b.countNumber - a.countNumber)[0];
    
    return lastCount?.difference === 0;
  });

  // Efecto para actualizar el status del inventario
  useEffect(() => {
    if (allProductsCorrect) {
      fetch("/api/inventory/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryId: inventory.id,
        }),
      }).catch(error => {
        console.error("Error updating inventory status:", error);
      });
    }
  }, [allProductsCorrect, inventory.id]);

  return (
    <div className={`relative overflow-x-auto rounded-md ${
      allProductsCorrect ? "bg-green-50" : ""
    }`}>
      <Table>
        <TableHeader>
          <TableRow className={allProductsCorrect ? "bg-green-100/50" : ""}>
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
            const sortedCounts = [...productInventory.counts]
              .sort((a, b) => b.countNumber - a.countNumber);

            // Si no hay conteos, mostrar una fila con los datos básicos
            if (sortedCounts.length === 0) {
              return (
                <TableRow key={productInventory.id}>
                  <TableCell>{productInventory.product.sku}</TableCell>
                  <TableCell>{productInventory.product.description}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">-</TableCell>
                  <TableCell className="text-right">{productInventory.erpQuantity}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              );
            }

            // El resto del código para productos con conteos se mantiene igual
            return (
              <React.Fragment key={productInventory.id}>
                {sortedCounts.map((count, index) => (
                  <TableRow 
                    key={count.id} 
                    className={`
                      ${index > 0 ? "bg-muted/50" : ""}
                      ${allProductsCorrect ? "bg-green-50" : ""}
                    `}
                  >
                    <TableCell className="font-medium">
                      {index === 0 ? productInventory.product.sku : ""}
                    </TableCell>
                    <TableCell>
                      {index === 0 ? productInventory.product.description : ""}
                    </TableCell>
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
                    <TableCell className="text-right">
                      {productInventory.erpQuantity}
                    </TableCell>
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