import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { parse } from "csv-parse"

interface CSVRow {
  SKU: string
  Descripcion: string
  Stock: string
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string

    if (!file || !name) {
      return NextResponse.json(
        { error: "Falta el archivo o el nombre" },
        { status: 400 }
      )
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileContent = new TextDecoder('latin1').decode(fileBuffer)
    
    const records: CSVRow[] = await new Promise((resolve, reject) => {
      const results: CSVRow[] = []
      const parser = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      })

      parser.on("data", (data: CSVRow) => results.push(data))
      parser.on("error", reject)
      parser.on("end", () => resolve(results))
    })

    // Crear el inventario fuera de la transacción
    const inventory = await db.inventory.create({
      data: {
        name,
        date: new Date(),
        status: "PENDING",
        createdById: 1, // TODO: Obtener el ID del usuario actual
      },
    })

    // Procesar los registros en lotes de 5 (como el archivo original que funcionaba)
    const batchSize = 5
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)
      
      await db.$transaction(async (tx) => {
        for (const record of batch) {
          const product = await tx.product.upsert({
            where: { sku: record.SKU },
            update: { description: record.Descripcion },
            create: {
              sku: record.SKU,
              description: record.Descripcion,
            },
          })

          await tx.productInventory.create({
            data: {
              inventoryId: inventory.id,
              productId: product.id,
              erpQuantity: parseInt(record.Stock),
              status: "PENDING",
            },
          })
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al crear el inventario:", error)
    return NextResponse.json(
      { error: "Error al procesar el archivo" },
      { status: 500 }
    )
  }
} 