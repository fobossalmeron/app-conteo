"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { NewInventoryModal } from "@/components/new-inventory-modal"

export function NewInventoryButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button 
        variant="default" 
        className="justify-start"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Nuevo inventario
      </Button>
      <NewInventoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 