import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AdvancedFilters } from "./advanced-filters"

export function SearchToolbar() {
  return (
    <div className="w-full lg:w-80 bg-background border-b lg:border-l p-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <Input placeholder="Search objects..." className="flex-grow" />
        <Button size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>
              Set advanced filters for celestial object search
            </SheetDescription>
          </SheetHeader>
          <AdvancedFilters />
        </SheetContent>
      </Sheet>
    </div>
  )
}

