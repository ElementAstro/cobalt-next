import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConnectionAlertProps {
  showAlert: boolean;
  alertType: "success" | "error" | "info";
}

export function ConnectionAlert({
  showAlert,
  alertType,
}: ConnectionAlertProps) {
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
          <Alert variant={alertType === "error" ? "destructive" : "default"}>
            {alertType === "success" && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
            {alertType === "error" && (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            {alertType === "info" && <Info className="h-4 w-4 text-blue-500" />}
            <AlertTitle>
              {alertType === "success"
                ? "Success"
                : alertType === "error"
                ? "Error"
                : "Info"}
            </AlertTitle>
            <AlertDescription>
              {alertType === "success"
                ? "Successfully connected to the server."
                : alertType === "error"
                ? "Failed to connect. Please check your credentials."
                : "This is an informational message."}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
