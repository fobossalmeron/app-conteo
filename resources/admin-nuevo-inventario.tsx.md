"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from 'lucide-react'

export default function Component() {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
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

    // Here you would typically handle the file upload and form submission
    // For example:
    // const formData = new FormData()
    // formData.append('title', title)
    // formData.append('file', file)
    // await fetch('/api/inventory', { method: 'POST', body: formData })
    
    router.push("/inventories")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col gap-1 p-4 bg-background border-r">
        <Button variant="ghost" className="justify-start font-semibold">
          Nuevo inventario
        </Button>
        <Button variant="ghost" className="justify-start text-muted-foreground">
          Ver conteos
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Nuevo inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título de Inventario</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Inventario semanal"
                  required
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
                disabled={!title || !file}
              >
                Confirmar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}