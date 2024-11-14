import { Suspense } from "react"
import { db } from "@/lib/db"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import ConteoCard from "@/components/conteo-card"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getProductosParaContar(inventoryId: string) {
  try {
    const inventory = await db.inventory.findFirst({
      where: {
        id: parseInt(inventoryId),
        status: {
          in: ["PENDING", "IN_PROGRESS"]
        },
      },
      include: {
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
    })

    if (!inventory) return null

    return {
      inventory,
      products: inventory.products.map((pi) => ({
        id: pi.id,
        sku: pi.product.sku,
        description: pi.product.description,
        erpQuantity: pi.erpQuantity,
        status: pi.status,
        lastCount: pi.counts[0],
      }))
    }
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return null
  }
}

export default async function ConteoPage({ params }: PageProps) {
  // Validar y esperar los parámetros
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
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver
        </Link>
        <div className="flex-1 max-w-sm">
          <Input type="search" placeholder="Buscar SKU" className="w-full" />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold">{inventory.name}</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Cargando productos...</div>}>
          {products.length > 0 ? (
            products.map((producto) => (
              <ConteoCard 
                key={producto.id} 
                producto={producto}
                countNumber={producto.lastCount?.countNumber ?? 0}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 p-4">
              No hay productos para contar en este momento
            </p>
          )}
        </Suspense>
      </div>
    </div>
  )
} 