'use client'

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import ConteoCard from "@/components/conteo-card"
import { CountStatus } from "@prisma/client"

interface SearchProductsProps {
  products: {
    id: number
    sku: string
    description: string
    erpQuantity: number
    status: CountStatus
    inventoryId: number
    lastCount: {
      id: number
      status: CountStatus
      createdAt: Date
      updatedAt: Date
      countNumber: number
      productInventoryId: number
      shelfQuantity: number
      surplusQuantity: number
      totalQuantity: number
      difference: number
      countedById: number
      countedAt: Date
    } | null
    countNumber: number
  }[]
}

export function SearchProducts({ products }: SearchProductsProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredProducts = products.filter(product => 
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Buscar SKU" 
          className="w-full pl-10 h-12 text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((producto) => (
            <ConteoCard 
              key={producto.id} 
              producto={producto}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 p-4">
            No se encontraron productos
          </p>
        )}
      </div>
    </>
  )
} 