'use client'

import { useState, useMemo } from 'react'
import { CelestialObjectCard } from "@/components/celestial-object-card"
import { SearchBar } from "@/components/search-bar"
import { FilterPanel } from "@/components/filter-panel"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { RealTimeData } from "@/components/real-time-data"
import { Pagination } from "@/components/pagination"

// 假设我们有一个更大的模拟数据集
const mockObjects = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `Celestial Object ${i + 1}`,
  type: ["OPNCL", "DRKNB", "BRTNB", "GALXY", "PLNTN", "STAR"][Math.floor(Math.random() * 6)],
  constellation: ["UMA", "CYG", "PYX", "ORI", "CAS", "LEO"][Math.floor(Math.random() * 6)],
  rightAscension: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}`,
  declination: `${Math.floor(Math.random() * 90)}° ${Math.floor(Math.random() * 60)}' ${Math.floor(Math.random() * 60)}"`,
  magnitude: Math.random() * 100,
  size: `${Math.floor(Math.random() * 1000)} arcmin`,
  distance: `${Math.floor(Math.random() * 10000)} ly`,
  riseTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  setTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  transitTime: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
  transitAltitude: Math.floor(Math.random() * 90),
}))

const ITEMS_PER_PAGE = 10

export default function AstronomySearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    constellations: [],
    types: [],
    minMagnitude: '',
    maxMagnitude: '',
  })
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredObjects = useMemo(() => {
    return mockObjects.filter(obj => {
      const matchesTerm = obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          obj.constellation.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesConstellation = filters.constellations.length === 0 || filters.constellations.includes(obj.constellation)
      const matchesType = filters.types.length === 0 || filters.types.includes(obj.type)
      const matchesMagnitude = (!filters.minMagnitude || obj.magnitude >= parseFloat(filters.minMagnitude)) &&
                               (!filters.maxMagnitude || obj.magnitude <= parseFloat(filters.maxMagnitude))
      return matchesTerm && matchesConstellation && matchesType && matchesMagnitude
    })
  }, [searchTerm, filters])

  const sortedObjects = useMemo(() => {
    return [...filteredObjects].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      } else {
        return 0;
      }
    });
  }, [filteredObjects, sortBy, sortOrder]);

  const paginatedObjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedObjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedObjects, currentPage]);

  const totalPages = Math.ceil(sortedObjects.length / ITEMS_PER_PAGE);

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-none p-4 border-b">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-4">
          <SearchBar onSearch={handleSearch} items={mockObjects} />
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="magnitude">Magnitude</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
              </SheetContent>
            </Sheet>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Celestial Objects</h1>
            <RealTimeData />
          </div>
          <div className="space-y-4">
            {paginatedObjects.map((item) => (
              <CelestialObjectCard key={item.id} {...item} isLoggedIn={false} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

