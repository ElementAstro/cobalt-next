import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchFilters } from "@/types/plugin";
import { usePluginStore } from "@/lib/store/plugin";

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const setSearchFilters = usePluginStore((state) => state.setSearchFilters);
  const searchFilters = usePluginStore((state) => state.searchFilters);

  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query, searchFilters);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search plugins..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 dark:bg-gray-800"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-gray-800 dark:bg-gray-900">
            <SheetHeader>
              <SheetTitle className="text-white">高级搜索</SheetTitle>
              <SheetDescription className="text-gray-300">
                使用额外的过滤条件细化你的搜索。
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  onValueChange={(value) =>
                    setSearchFilters({ ...searchFilters, category: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="planetarium">Planetarium</SelectItem>
                    <SelectItem value="telescope-control">
                      Telescope Control
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Min Rating
                </Label>
                <Slider
                  id="rating"
                  max={5}
                  step={0.5}
                  className="col-span-3"
                  onValueChange={(value) =>
                    setSearchFilters({ ...searchFilters, minRating: value[0] })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Max Price
                </Label>
                <Slider
                  id="price"
                  max={100}
                  step={5}
                  className="col-span-3"
                  onValueChange={(value) =>
                    setSearchFilters({ ...searchFilters, maxPrice: value[0] })
                  }
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full">
              应用过滤条件
            </Button>
          </SheetContent>
        </Sheet>
        <Button onClick={handleSearch} className="mt-2 sm:mt-0">
          搜索
        </Button>
      </div>
    </div>
  );
}
