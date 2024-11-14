import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      )
    }

    await db.$transaction(async (tx) => {
      // Primero eliminar los conteos relacionados
      await tx.count.deleteMany({
        where: {
          productInventory: {
            inventoryId: id
          }
        }
      })

      // Luego eliminar las relaciones producto-inventario
      await tx.productInventory.deleteMany({
        where: {
          inventoryId: id
        }
      })

      // Finalmente eliminar el inventario
      await tx.inventory.delete({
        where: {
          id: id
        }
      })
    })

    return NextResponse.json({ message: "Inventario eliminado exitosamente" })
  } catch (error) {
    console.error("Error al eliminar inventario:", error)
    return NextResponse.json(
      { error: "Error al eliminar el inventario" },
      { status: 500 }
    )
  }
} 