import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

interface AddNodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (key: string, value: any) => void;
}

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

export default function AddNodeDialog({
  isOpen,
  onClose,
  onAdd,
}: AddNodeDialogProps) {
  const [key, setKey] = useState("");
  const [valueType, setValueType] = useState("string");
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (!key.trim()) {
      alert("键名不能为空");
      return;
    }
    let parsedValue: any = value;
    if (valueType === "number") {
      parsedValue = Number(value);
    } else if (valueType === "boolean") {
      parsedValue = value.toLowerCase() === "true";
    } else if (valueType === "object") {
      try {
        parsedValue = JSON.parse(value);
      } catch (error) {
        alert("无效的对象格式");
        return;
      }
    } else if (valueType === "array") {
      try {
        parsedValue = JSON.parse(value);
        if (!Array.isArray(parsedValue)) {
          throw new Error("不是一个数组");
        }
      } catch (error) {
        alert("无效的数组格式");
        return;
      }
    }
    onAdd(key, parsedValue);
    setKey("");
    setValue("");
    setValueType("string");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card p-6 rounded-lg">
        <motion.div
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col space-y-4"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              添加新节点
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {/* Key Input */}
            <div className="flex flex-col">
              <Label
                htmlFor="key"
                className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Key
              </Label>
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="请输入键名"
                className="mt-1"
                aria-label="键名输入框"
              />
            </div>
            {/* Type Selection */}
            <div className="flex flex-col">
              <Label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </Label>
              <RadioGroup
                value={valueType}
                onValueChange={setValueType}
                className="flex flex-wrap gap-2"
                aria-label="值类型选择"
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="string" id="string" />
                  <Label
                    htmlFor="string"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    String
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="number" id="number" />
                  <Label
                    htmlFor="number"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Number
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="boolean" id="boolean" />
                  <Label
                    htmlFor="boolean"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Boolean
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="object" id="object" />
                  <Label
                    htmlFor="object"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Object
                  </Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="array" id="array" />
                  <Label
                    htmlFor="array"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Array
                  </Label>
                </div>
              </RadioGroup>
            </div>
            {/* Value Input */}
            {(valueType === "string" ||
              valueType === "number" ||
              valueType === "boolean") && (
              <div className="flex flex-col">
                <Label
                  htmlFor="value"
                  className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Value
                </Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`请输入${valueType}值`}
                  className="mt-1"
                  aria-label="值输入框"
                />
              </div>
            )}
            {/* Value Input for Object and Array */}
            {(valueType === "object" || valueType === "array") && (
              <div className="flex flex-col">
                <Label
                  htmlFor="value"
                  className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Value (JSON Format)
                </Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={`请输入${valueType}值（JSON格式）`}
                  className="mt-1"
                  aria-label={`${valueType}值输入框`}
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              onClick={onClose}
              variant="outline"
              aria-label="取消添加节点"
            >
              取消
            </Button>
            <Button
              onClick={handleAdd}
              className="bg-primary hover:bg-primary/80"
              aria-label="确认添加节点"
            >
              添加节点
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
