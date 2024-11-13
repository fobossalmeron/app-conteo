"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface InventoryItem {
  sku: string
  description: string
  anaquel: number
  excedente: number
  total: number
  intelisis: number
  difference: number
  isRecount?: boolean
  status: "success" | "error" | "neutral"
}

const inventoryData: InventoryItem[] = [
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
    anaquel: 50,
    excedente: 120,
    total: 27,
    intelisis: 30,
    difference: -2,
    status: "error"
  },
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
    anaquel: 50,
    excedente: 120,
    total: 50,
    intelisis: 50,
    difference: 0,
    status: "success"
  },
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
    anaquel: 50,
    excedente: 120,
    total: 24,
    intelisis: 25,
    difference: -1,
    status: "error"
  },
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
    anaquel: 50,
    excedente: 120,
    total: 25,
    intelisis: 25,
    difference: 0,
    isRecount: true,
    status: "success"
  },
  {
    sku: "301-440-P",
    description: "Tubo Borgatta Roth UR..",
    anaquel: 50,
    excedente: 120,
    total: 60,
    intelisis: 61,
    difference: -1,
    status: "error"
  },
]

export default function Component() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col gap-1 p-4 bg-background border-r">
        <Button variant="ghost" className="justify-start text-muted-foreground">
          Nuevo inventario
        </Button>
        <Button variant="ghost" className="justify-start font-semibold">
          Ver conteos
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <Card>
          <CardHeader className="space-y-1">
            <div className="text-sm text-muted-foreground">Inventario</div>
            <CardTitle className="text-2xl font-bold">
              Inventario semanal de producto terminado
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              10 de octubre 2024
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                  {inventoryData.map((item, index) => (
                    <TableRow key={index} className="group">
                      <TableCell className="font-medium">
                        {item.isRecount ? (
                          <div className="text-sm text-muted-foreground">
                            Conteo 2
                          </div>
                        ) : (
                          item.sku
                        )}
                      </TableCell>
                      <TableCell>
                        {item.isRecount ? "" : item.description}
                      </TableCell>
                      <TableCell className="text-right">{item.anaquel}</TableCell>
                      <TableCell className="text-right">
                        {item.excedente}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded ${
                            item.status === "success"
                              ? "bg-green-100"
                              : item.status === "error"
                              ? "bg-red-100"
                              : ""
                          }`}
                        >
                          {item.total}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{item.intelisis}</TableCell>
                      <TableCell className="text-right">
                        {item.difference !== 0 && (
                          <span className="text-red-500">
                            {item.difference}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}