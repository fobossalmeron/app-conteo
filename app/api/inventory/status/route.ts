import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const { inventoryId } = await request.json()

    // Obtener el inventario con sus productos y conteos
    const inventory = await db.inventory.findUnique({
      where: { id: inventoryId },
      include: {
        products: {
          include: {
            counts: {
              orderBy: {
                countNumber: 'desc'
              },
              take: 1
            }
          }
        }
      }
    })

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventario no encontrado" },
        { status: 404 }
      )
    }

    // Verificar si todos los productos tienen conteos exitosos
    const allProductsCorrect = inventory.products.every(
      (productInventory) => productInventory.counts[0]?.difference === 0
    )

    if (allProductsCorrect) {
      // Actualizar el status del inventario a COMPLETED
      await db.inventory.update({
        where: { id: inventoryId },
        data: { status: "COMPLETED" }
      })
    }

    return NextResponse.json({ status: allProductsCorrect ? "COMPLETED" : "IN_PROGRESS" })
  } catch (error) {
    console.error("Error updating inventory status:", error)
    return NextResponse.json(
      { error: "Error al actualizar el estado del inventario" },
      { status: 500 }
    )
  }
} 