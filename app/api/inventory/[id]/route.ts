import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
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
      await tx.count.deleteMany({
        where: {
          productInventory: {
            inventoryId: id
          }
        }
      })

      await tx.productInventory.deleteMany({
        where: {
          inventoryId: id
        }
      })

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