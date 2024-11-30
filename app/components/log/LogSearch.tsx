import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogSearchProps {
  onSearch: (searchTerm: string, searchField: string) => void;
}

export function LogSearch({ onSearch }: LogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("all");

  const handleSearch = () => {
    onSearch(searchTerm, searchField);
  };

  return (
    <div className="flex space-x-2">
      <Input
        type="text"
        placeholder="搜索日志..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select value={searchField} onValueChange={setSearchField}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="搜索字段" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部</SelectItem>
          <SelectItem value="message">消息</SelectItem>
          <SelectItem value="source">来源</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSearch}>搜索</Button>
    </div>
  );
}
