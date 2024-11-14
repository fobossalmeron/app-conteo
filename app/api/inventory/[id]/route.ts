import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id: paramId } = await params
    const id = parseInt(paramId as string)
    
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