"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { useState } from "react"
import { NewInventoryModal } from "@/components/new-inventory-modal"

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="hidden md:flex w-64 flex-col gap-1 p-4 bg-background border-r space-y-4">
      <Link href="/admin">
        <div className="h-8 w-fit rounded-full bg-slate-900 flex items-center justify-start text-primary-foreground font-medium text-lg px-3 hover:bg-white hover:text-black transition-colors">
          Conteos e inventarios
        </div>
      </Link>
    </div>
  );
}
