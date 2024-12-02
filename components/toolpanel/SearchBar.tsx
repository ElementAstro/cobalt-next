import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearHistory: () => void;
  disabled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch, onClearHistory, disabled }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
      <Input
        type="search"
        placeholder="搜索工具..."
        value={searchTerm}
        onChange={onSearch}
        className="w-full sm:w-auto"
      />
      <Button onClick={onClearHistory} variant="outline" disabled={disabled} className="w-full sm:w-auto">
        清除历史
      </Button>
    </div>
  )
}

export default SearchBar