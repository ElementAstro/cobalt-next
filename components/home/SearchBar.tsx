import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-indigo-500 focus:border-indigo-400 focus:ring focus:ring-indigo-300 focus:ring-opacity-50 bg-indigo-800 text-white placeholder-indigo-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" />
    </div>
  );
};

export default SearchBar;
