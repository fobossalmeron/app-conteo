"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CountState {
  anaquel: string
  excedente: string
  status: "initial" | "success" | "error"
}

export default function Component() {
  const [countState, setCountState] = useState<CountState>({
    anaquel: "",
    excedente: "",
    status: "initial"
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate validation - in this case, matching numbers
    if (countState.anaquel === countState.excedente) {
      setCountState(prev => ({ ...prev, status: "success" }))
    } else {
      setCountState(prev => ({ ...prev, status: "error" }))
    }
  }

  const handleRecount = () => {
    setCountState({
      anaquel: "",
      excedente: "",
      status: "initial"
    })
  }

  const getCardClassName = () => {
    const baseClass = "w-full max-w-md mx-auto mt-4 p-6 space-y-4"
    switch (countState.status) {
      case "success":
        return `${baseClass} bg-green-100`
      case "error":
        return `${baseClass} bg-red-100`
      default:
        return `${baseClass} bg-background`
    }
  }

  return (
    <div className="min-h-screen p-4 space-y-4 bg-gray-100">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver
        </Link>
        <div className="flex-1 max-w-sm">
          <Input
            type="search"
            placeholder="Buscar"
            className="w-full"
          />
        </div>
      </div>

      <Card className={getCardClassName()}>
        <CardContent className="p-0 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">A-W-ME021401</p>
              <h2 className="text-2xl font-semibold">
                Arcos Memalloy Borgatta .014 superiores 10 piezas
              </h2>
            </div>
            {countState.status !== "initial" && (
              <Badge variant={countState.status === "success" ? "default" : "destructive"}>
                {countState.status === "success" ? "Conteo exitoso" : "Conteo fallido"}
              </Badge>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="anaquel" className="text-sm font-medium">
                  Anaquel
                </label>
                <Input
                  id="anaquel"
                  type="number"
                  value={countState.anaquel}
                  onChange={(e) => setCountState(prev => ({ ...prev, anaquel: e.target.value }))}
                  disabled={countState.status !== "initial"}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="excedente" className="text-sm font-medium">
                  Excedente
                </label>
                <Input
                  id="excedente"
                  type="number"
                  value={countState.excedente}
                  onChange={(e) => setCountState(prev => ({ ...prev, excedente: e.target.value }))}
                  disabled={countState.status !== "initial"}
                  required
                />
              </div>
            </div>

            {countState.status === "initial" ? (
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleRecount}
                variant={countState.status === "success" ? "outline" : "default"}
                className="w-full"
              >
                Contar de nuevo
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}