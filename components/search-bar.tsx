import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import Fuse from 'fuse.js'

interface SearchBarProps {
  onSearch: (term: string) => void
  items: Array<{ name: string; constellation: string; type: string }>
}

export function SearchBar({ onSearch, items }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<Array<{ name: string; constellation: string; type: string }>>([])
  const fuseRef = useRef<Fuse<{ name: string; constellation: string; type: string }> | null>(null)

  useEffect(() => {
    fuseRef.current = new Fuse(items, {
      keys: ['name', 'constellation', 'type'],
      threshold: 0.3,
    })
  }, [items])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value && fuseRef.current) {
      const results = fuseRef.current.search(value)
      setSuggestions(results.map(result => result.item).slice(0, 5))
    } else {
      setSuggestions([])
    }

    onSearch(value)
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex">
        <Input
          type="text"
          placeholder="Search celestial objects..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-grow"
        />
        <Button type="submit" size="icon" className="ml-2">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-background border rounded-md mt-1 max-h-60 overflow-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-accent cursor-pointer"
              onClick={() => {
                setSearchTerm(item.name)
                onSearch(item.name)
                setSuggestions([])
              }}
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {item.constellation} - {item.type}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

