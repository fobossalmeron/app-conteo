"use client"

import { useState } from "react"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const handleRefresh = async () => {
    setIsRefreshing(true)
    
    try {
      // Refrescar los datos de la página
      router.refresh()
      
      // Simular un tiempo mínimo de carga para feedback visual
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      {isRefreshing ? "Refrescando..." : "Refrescar"}
    </Button>
  )
} 