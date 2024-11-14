import { Suspense } from "react"
import { db } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ConteoCard from "@/components/conteo-card"
import { notFound } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { SearchProducts } from "./search-products"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

// Separamos la acción del servidor
async function updateInventoryStatus(inventoryId: string) {
  'use server'
  
  try {
    await db.inventory.update({
      where: { id: parseInt(inventoryId) },
      data: { status: 'IN_PROGRESS' }
    })
    
    // Movemos revalidatePath fuera de la función principal
    revalidatePath(`/inventario/${inventoryId}/conteo`)
    revalidatePath('/admin')
  } catch (error) {
    console.error('Error actualizando estado del inventario:', error)
  }
}

async function getProductosParaContar(inventoryId: string) {
  try {
    const inventory = await db.inventory.findUnique({
      where: { 
        id: parseInt(inventoryId) 
      },
      select: {
        id: true,
        name: true,
        status: true,
        products: {
          include: {
            product: true,
            counts: {
              orderBy: {
                countNumber: 'desc'
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!inventory) return null;

    // Si el inventario está pendiente, llamamos a la acción del servidor
    // pero NO esperamos su resultado
    if (inventory.status === 'PENDING') {
      updateInventoryStatus(inventoryId)
    }

    return {
      inventory,
      products: inventory.products.map((pi) => ({
        id: pi.id,
        sku: pi.product.sku,
        description: pi.product.description,
        erpQuantity: pi.erpQuantity,
        status: pi.status,
        inventoryId: inventory.id,
        lastCount: pi.counts[0],
        countNumber: pi.counts[0]?.countNumber ?? 0
      }))
    };
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return null
  }
}

export default async function ConteoPage({ params }: PageProps) {
  const validParams = await params
  if (!validParams?.id) {
    return notFound()
  }

  const data = await getProductosParaContar(validParams.id)
  
  if (!data) {
    return notFound()
  }

  const { inventory, products } = data

  return (
    <div className="min-h-screen p-4 space-y-4 bg-gray-100">
      <div className="flex items-center justify-between gap-4">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{inventory.name}</h1>
      </div>

      <Suspense fallback={<div>Cargando productos...</div>}>
        <SearchProducts products={products} />
      </Suspense>
    </div>
  )
} 