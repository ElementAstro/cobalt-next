import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationWarningsProps {
  errors: string[];
  warnings: string[];
}

export function ValidationWarnings({ errors, warnings }: ValidationWarningsProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-2"
      >
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTitle>验证错误</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {warnings.length > 0 && (
          <Alert>
            <AlertTitle>警告</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {warnings.map((warning, i) => (
                  <li key={i}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
