"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CountStatus } from "@prisma/client"
import ConteoForm from "@/components/conteo-form"

interface ProductoConteo {
  id: number;
  sku: string;
  description: string;
  erpQuantity: number;
  status: CountStatus;
  inventoryId: number;
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

  const checkInventoryStatus = async () => {
    try {
      await fetch("/api/inventory/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inventoryId: producto.inventoryId,
        }),
      });
    } catch (error) {
      console.error("Error checking inventory status:", error);
    }
  };

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
                surplusQuantity: producto.lastCount.surplusQuantity,
                countNumber: producto.lastCount.countNumber
              } : undefined}
              onSuccess={() => {
                status.set("success");
                checkInventoryStatus();
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