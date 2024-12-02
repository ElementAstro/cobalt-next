import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

interface Tab {
  value: string
  label: string
  content: React.ReactNode
}

interface VerticalTabsProps {
  tabs: Tab[]
}

export function VerticalTabs({ tabs }: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].value)

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="w-full sm:w-1/4 mb-4 sm:mb-0">
        {tabs.map((tab) => (
          <Button
            key={tab.value}
            variant={activeTab === tab.value ? "default" : "ghost"}
            className="w-full justify-start text-left mb-2"
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="w-full sm:w-3/4 sm:pl-4">
        {tabs.find((tab) => tab.value === activeTab)?.content}
      </div>
    </div>
  )
}

