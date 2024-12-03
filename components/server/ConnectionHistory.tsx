import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ConnectionHistoryProps {
  isVisible: boolean
  onClose: () => void
  history: string[]
}

export function ConnectionHistory({ isVisible, onClose, history }: ConnectionHistoryProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-x-0 bottom-0 z-50 p-4 bg-background border-t border-border"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Connection History</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-40">
        {history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index} className="bg-muted p-2 rounded-md">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">No connection history yet.</p>
        )}
      </ScrollArea>
    </motion.div>
  )
}

