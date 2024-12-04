"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// import { InfoIcon } from "lucide-react";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";

interface ConteoFormProps {
  inventoryProductId: number;
  erpQuantity: number;
  initialValues?: {
    shelfQuantity: number;
    surplusQuantity: number;
    countNumber: number;
  };
  onSuccess?: () => void;
  onError?: () => void;
}

export default function ConteoForm({ 
  inventoryProductId, 
  erpQuantity, 
  initialValues,
  onSuccess,
  onError 
}: ConteoFormProps) {
  const [state, setState] = useState({
    status: initialValues ? 
      (initialValues.shelfQuantity + initialValues.surplusQuantity === erpQuantity ? 'success' : 'error') : 
      'initial',
    shelfQuantity: initialValues?.shelfQuantity?.toString() || '',
    surplusQuantity: initialValues?.surplusQuantity?.toString() || '',
    countNumber: initialValues?.countNumber || 1,
    isDisabled: !!initialValues
  });

  const handleRecount = useCallback(() => {
    setState(prev => ({
      status: 'initial',
      shelfQuantity: '',
      surplusQuantity: '',
      countNumber: prev.countNumber,
      isDisabled: false
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDisabled: true }));

    try {
      const shelfQuantity = parseInt(state.shelfQuantity);
      const surplusQuantity = parseInt(state.surplusQuantity);
      const total = shelfQuantity + surplusQuantity;

      const response = await fetch("/api/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productInventoryId: inventoryProductId,
          shelfQuantity,
          surplusQuantity,
          countNumber: state.countNumber + 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el conteo");
      }

      const newStatus = total === erpQuantity ? "success" : "error";
      
      setState(prev => ({
        ...prev,
        status: newStatus,
        countNumber: prev.countNumber + 1,
        isDisabled: true
      }));
      
      if (newStatus === 'success' && onSuccess) {
        onSuccess();
      } else if (newStatus === 'error' && onError) {
        onError();
      }
    } catch (error) {
      console.error("Error:", error);
      setState(prev => ({
        ...prev,
        status: 'error',
        isDisabled: true
      }));
      if (onError) {
        onError();
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {state.status !== "initial" && (
            <Badge 
              variant={state.status === "success" ? "success" : "destructive"} 
              className="mb-4 p-2 px-3"
            >
              {state.status === "success" ? 
                "Conteo exitoso" : 
                `Diferencia: ${
                  (parseInt(state.shelfQuantity) + parseInt(state.surplusQuantity)) - erpQuantity
                }`
              }
            </Badge>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`shelf-${inventoryProductId}`}>Anaquel</Label>
            <Input
              id={`shelf-${inventoryProductId}`}
              type="number"
              value={state.shelfQuantity}
              onChange={(e) => setState(prev => ({ ...prev, shelfQuantity: e.target.value }))}
              disabled={state.status !== 'initial'}
              placeholder="0"
              required
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`surplus-${inventoryProductId}`}>Excedente</Label>
            <Input
              id={`surplus-${inventoryProductId}`}
              type="number"
              value={state.surplusQuantity}
              onChange={(e) => setState(prev => ({ ...prev, surplusQuantity: e.target.value }))}
              disabled={state.status !== 'initial'}
              placeholder="0"
              required
              min="0"
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-4">
          {state.status === "initial" ? (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.shelfQuantity || !state.surplusQuantity || state.isDisabled}
            >
              {state.isDisabled ? "Guardando..." : "Guardar"}
            </Button>
          ) : (
            <Button
              type="button"
              variant={state.status === "success" ? "outline" : "default"}
              className="w-full"
              onClick={handleRecount}
            >
              Contar de nuevo
            </Button>
          )}
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <InfoIcon className="h-4 w-4 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-mono">ERP: {erpQuantity}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
      </form>
    </div>
  );
}
