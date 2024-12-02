import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AddNodeDialogProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (key: string, value: any) => void
}

export default function AddNodeDialog({ isOpen, onClose, onAdd }: AddNodeDialogProps) {
  const [key, setKey] = useState('')
  const [valueType, setValueType] = useState('string')
  const [value, setValue] = useState('')

  const handleAdd = () => {
    if (!key.trim()) {
      alert("键名不能为空");
      return;
    }
    let parsedValue: any = value
    if (valueType === 'number') {
      parsedValue = Number(value)
    } else if (valueType === 'boolean') {
      parsedValue = value === 'true'
    } else if (valueType === 'object') {
      parsedValue = {}
    } else if (valueType === 'array') {
      parsedValue = []
    }
    onAdd(key, parsedValue)
    setKey('')
    setValue('')
    setValueType('string')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="key" className="text-right">
              Key
            </Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Type</Label>
            <RadioGroup value={valueType} onValueChange={setValueType} className="col-span-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="string" id="string" />
                <Label htmlFor="string">String</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="number" id="number" />
                <Label htmlFor="number">Number</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="boolean" id="boolean" />
                <Label htmlFor="boolean">Boolean</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="object" id="object" />
                <Label htmlFor="object">Object</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="array" id="array" />
                <Label htmlFor="array">Array</Label>
              </div>
            </RadioGroup>
          </div>
          {valueType !== 'object' && valueType !== 'array' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="value" className="text-right">
                Value
              </Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAdd}>Add Node</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

