"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from 'lucide-react'

interface UploadInventoryFormProps {
  onSuccess?: () => void
}

export default function UploadInventoryForm({ onSuccess }: UploadInventoryFormProps) {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type === "text/csv") {
      setFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === "text/csv") {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('name', title)
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/inventory', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al crear el inventario')
      }

      router.refresh()
      onSuccess?.()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título de Inventario</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Inventario semanal"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="csv">Archivo CSV</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/10" : "border-muted"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Input
            id="csv"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={isLoading}
          />
          <Label
            htmlFor="csv"
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            {file ? (
              <span className="text-sm text-muted-foreground">
                Archivo seleccionado: {file.name}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Arrastra y suelta tu .CSV aquí o haz click para seleccionarlo
              </span>
            )}
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full md:w-auto"
        disabled={!title || !file || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando inventario...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Confirmar
          </>
        )}
      </Button>
    </form>
  )
} 