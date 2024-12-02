import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SearchFilters } from '@/types/plugin'

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})

  const handleSearch = () => {
    onSearch(query, filters)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plugins..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Advanced Search</SheetTitle>
              <SheetDescription>
                Refine your search with additional filters.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={(value) => setFilters({ ...filters, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="planetarium">Planetarium</SelectItem>
                    <SelectItem value="telescope-control">Telescope Control</SelectItem>
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
                  onValueChange={(value) => setFilters({ ...filters, minRating: value[0] })}
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
                  onValueChange={(value) => setFilters({ ...filters, maxPrice: value[0] })}
                />
              </div>
            </div>
            <Button onClick={handleSearch}>Apply Filters</Button>
          </SheetContent>
        </Sheet>
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  )
}

