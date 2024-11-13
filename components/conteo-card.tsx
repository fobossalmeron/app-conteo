"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CountStatus } from "@prisma/client"
import ConteoForm from "@/components/conteo-form"

interface ProductoConteo {
  id: number
  sku: string
  description: string
  erpQuantity: number
  status: CountStatus
  lastCount?: {
    shelfQuantity: number
    surplusQuantity: number
  } | null
}

interface ConteoCardProps {
  producto: ProductoConteo
}

function ConteoCardWrapper({ children }: { 
  children: (status: { 
    value: "initial" | "success" | "error",
    set: (value: "initial" | "success" | "error") => void 
  }) => React.ReactNode 
}) {
  const [status, setStatus] = useState<"initial" | "success" | "error">("initial")
  return children({ value: status, set: setStatus })
}

export default function ConteoCard({ producto }: ConteoCardProps) {
  return (
    <ConteoCardWrapper>
      {(status) => (
        <Card className={`w-full transition-colors ${
          status.value === "success" ? "bg-green-100" :
          status.value === "error" ? "bg-red-100" :
          "bg-background"
        }`}>
          <CardHeader>
            <CardTitle>{producto.description}</CardTitle>
            <CardDescription>{producto.sku}</CardDescription>
          </CardHeader>
          <CardContent>
            <ConteoForm producto={producto} onStatusChange={(newStatus) => status.set(newStatus)} />
          </CardContent>
        </Card>
      )}
    </ConteoCardWrapper>
  )
} 