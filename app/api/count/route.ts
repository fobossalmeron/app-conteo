import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { productInventoryId, shelfQuantity, surplusQuantity, countNumber } = await request.json()

    const productInventory = await db.productInventory.findUnique({
      where: { id: productInventoryId },
      include: { 
        counts: {
          where: {
            countNumber: countNumber
          }
        },
        inventory: true
      },
    })

    if (!productInventory) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      )
    }

    const totalQuantity = shelfQuantity + surplusQuantity
    const difference = totalQuantity - productInventory.erpQuantity

    // Usar una transacción para asegurar que ambas operaciones se completen
    await db.$transaction(async (tx) => {
      // Crear o actualizar el conteo
      await tx.count.upsert({
        where: {
          productInventoryId_countNumber: {
            productInventoryId,
            countNumber
          }
        },
        create: {
          productInventoryId,
          shelfQuantity,
          surplusQuantity,
          totalQuantity,
          difference,
          countNumber,
          status: "PENDING",
          countedById: 1, // TODO: Obtener el ID del usuario actual
        },
        update: {
          shelfQuantity,
          surplusQuantity,
          totalQuantity,
          difference,
          status: "PENDING",
        }
      })

      // Si es el primer conteo y el inventario está en PENDING, actualizarlo a IN_PROGRESS
      if (countNumber === 1 && productInventory.inventory.status === "PENDING") {
        await tx.inventory.update({
          where: { id: productInventory.inventory.id },
          data: { status: "IN_PROGRESS" },
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al guardar el conteo:", error)
    return NextResponse.json(
      { error: "Error al guardar el conteo" },
      { status: 500 }
    )
  }
} 