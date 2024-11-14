"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import UploadInventoryForm from "@/components/upload-inventory-form"

interface NewInventoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewInventoryModal({ isOpen, onClose }: NewInventoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nuevo inventario</DialogTitle>
        </DialogHeader>
        <UploadInventoryForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  )
} 