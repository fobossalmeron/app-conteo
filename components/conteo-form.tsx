"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CountStatus } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface ConteoFormProps {
  producto: {
    id: number;
    sku: string;
    description: string;
    erpQuantity: number;
    status: CountStatus;
    lastCount?: {
      shelfQuantity: number;
      surplusQuantity: number;
    } | null;
  };
  onStatusChange: (status: "initial" | "success" | "error") => void;
}

export default function ConteoForm({
  producto,
  onStatusChange,
}: ConteoFormProps) {
  const [formData, setFormData] = useState({
    shelfQuantity: "",
    surplusQuantity: "",
  });
  const [status, setStatus] = useState<"initial" | "success" | "error">(
    "initial"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const shelfQuantity = parseInt(formData.shelfQuantity) || 0;
      const surplusQuantity = parseInt(formData.surplusQuantity) || 0;
      const totalQuantity = shelfQuantity + surplusQuantity;

      const response = await fetch("/api/count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productInventoryId: producto.id,
          shelfQuantity,
          surplusQuantity,
        }),
      });

      if (!response.ok) throw new Error("Error al guardar");

      const newStatus =
        totalQuantity === producto.erpQuantity ? "success" : "error";
      setStatus(newStatus);
      onStatusChange(newStatus);
    } catch (error) {
      setStatus("error");
      onStatusChange("error");
      console.error("Error al guardar conteo:", error);
    }
  };

  const handleRecount = () => {
    setFormData({
      shelfQuantity: "",
      surplusQuantity: "",
    });
    setStatus("initial");
    onStatusChange("initial");
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {status !== "initial" && (
            <Badge variant={status === "success" ? "success" : "destructive"} className="mb-4">
              {status === "success" ? "Conteo exitoso" : "Conteo fallido"}
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Anaquel</label>
            <Input
              type="number"
              value={formData.shelfQuantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  shelfQuantity: e.target.value,
                }))
              }
              disabled={status !== "initial"}
              min="0"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Excedente</label>
            <Input
              type="number"
              value={formData.surplusQuantity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  surplusQuantity: e.target.value,
                }))
              }
              disabled={status !== "initial"}
              min="0"
              required
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-4">
        {status === "initial" ? (
          <Button type="submit" className="w-full">
            Guardar
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleRecount}
            variant={status === "success" ? "outline" : "default"}
            className="w-full"
          >
            Contar de nuevo
          </Button>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <InfoIcon className="h-4 w-4 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="font-mono">ERP: {producto.erpQuantity}</p>
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </div>
      </form>
    </div>
  );
}
