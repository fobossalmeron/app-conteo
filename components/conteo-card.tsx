"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Count, CountStatus, Product } from "@prisma/client"
import ConteoForm from "@/components/conteo-form"

interface ProductoConteo {
  id: number;
  sku: string;
  description: string;
  erpQuantity: number;
  status: CountStatus;
  lastCount?: {
    id: number;
    shelfQuantity: number;
    surplusQuantity: number;
    totalQuantity: number;
    difference: number;
    countNumber: number;
    status: CountStatus;
  } | null;
}

interface ConteoCardProps {
  producto: ProductoConteo;
}

function ConteoCardWrapper({ initialStatus, children }: { 
  initialStatus: "initial" | "success" | "error"
  children: (status: { 
    value: "initial" | "success" | "error",
    set: (value: "initial" | "success" | "error") => void 
  }) => React.ReactNode 
}) {
  const [status, setStatus] = useState<"initial" | "success" | "error">(initialStatus)
  return children({ value: status, set: setStatus })
}

export default function ConteoCard({ producto }: ConteoCardProps) {
  const initialStatus = producto.lastCount ? 
    (producto.lastCount.difference === 0 ? "success" : "error") : 
    "initial";

  return (
    <ConteoCardWrapper initialStatus={initialStatus}>
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
            <ConteoForm 
              inventoryProductId={producto.id}
              erpQuantity={producto.erpQuantity}
              initialValues={producto.lastCount ? {
                shelfQuantity: producto.lastCount.shelfQuantity,
                surplusQuantity: producto.lastCount.surplusQuantity
              } : undefined}
              onSuccess={() => {
                status.set("success");
              }}
              onError={() => {
                status.set("error");
              }}
            />
          </CardContent>
        </Card>
      )}
    </ConteoCardWrapper>
  )
} 