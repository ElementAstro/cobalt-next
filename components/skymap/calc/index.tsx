"use client"

import { useEffect } from 'react'
import { useAstronomyStore } from '@/lib/store/skymap/calc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator } from "./calculator"
import { EquipmentSelector } from "./EquipmentSelector"
import { PreviewWindow } from "./PreviewWindow"
import { Header } from "./header"
import { EquipmentManager } from "./EquipmentManager"

export default function AstronomyTool() {

  return (
    <div className={`min-h-screen bg-background p-4 space-y-6 transition-colors duration-300`}>
      <Header />
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="manage">Manage Equipment</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator">
          <Calculator />
        </TabsContent>
        <TabsContent value="equipment">
          <EquipmentSelector />
        </TabsContent>
        <TabsContent value="preview">
          <PreviewWindow />
        </TabsContent>
        <TabsContent value="manage">
          <EquipmentManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}

