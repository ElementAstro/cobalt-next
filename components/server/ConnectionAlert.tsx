import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConnectionAlertProps {
  showAlert: boolean
  alertType: 'success' | 'error'
}

export function ConnectionAlert({ showAlert, alertType }: ConnectionAlertProps) {
  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Alert variant={alertType === 'success' ? 'default' : 'destructive'}>
            {alertType === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{alertType === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>
              {alertType === 'success' 
                ? 'Successfully connected to the server.' 
                : 'Failed to connect. Please check your credentials.'}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

