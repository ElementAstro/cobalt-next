import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface CreateScriptDialogProps {
  newScript: { name: string; content: string };
  setNewScript: React.Dispatch<
    React.SetStateAction<{ name: string; content: string }>
  >;
  handleCreateScript: () => void;
}

export default function CreateScriptDialog({
  newScript,
  setNewScript,
  handleCreateScript,
}: CreateScriptDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          创建新脚本
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>创建新脚本</DialogTitle>
          <DialogDescription>输入新脚本的名称和内容。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right text-gray-700 dark:text-gray-300"
            >
              名称
            </Label>
            <Input
              id="name"
              value={newScript.name}
              onChange={(e) =>
                setNewScript({ ...newScript, name: e.target.value })
              }
              className="col-span-3"
              placeholder="输入脚本名称"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="content"
              className="text-right mt-2 text-gray-700 dark:text-gray-300"
            >
              内容
            </Label>
            <Textarea
              id="content"
              value={newScript.content}
              onChange={(e) =>
                setNewScript({ ...newScript, content: e.target.value })
              }
              className="col-span-3"
              placeholder="输入脚本内容"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreateScript}
            disabled={!newScript.name || !newScript.content}
          >
            创建脚本
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
