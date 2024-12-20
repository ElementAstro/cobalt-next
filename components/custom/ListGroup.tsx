import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FixedSizeList as List } from 'react-window'
import AutoSizer from "react-virtualized-auto-sizer"

interface ListItem {
  id: string
  label: string
  description?: string
  group?: string
}

interface ListGroupProps {
  items: ListItem[]
  onItemSelect?: (item: ListItem) => void
  onItemsReorder?: (items: ListItem[]) => void
  multiSelect?: boolean
  searchable?: boolean
  maxHeight?: string
  animationDuration?: number
  customItemRender?: (item: ListItem, isSelected: boolean) => React.ReactNode
  groupBy?: (item: ListItem) => string
  theme?: 'light' | 'dark'
  virtualizeThreshold?: number
  loadMoreItems?: () => Promise<ListItem[]>
  selectedItemIds?: string[]
}

const SortableItem = ({ item, isSelected, onClick, customRender }: { item: ListItem; isSelected: boolean; onClick: () => void; customRender?: (item: ListItem, isSelected: boolean) => React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
        isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
      }`}
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
    >
      {customRender ? (
        customRender(item, isSelected)
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{item.label}</div>
            {item.description && (
              <div className="text-sm text-gray-500">{item.description}</div>
            )}
          </div>
          {isSelected && <ChevronRight className="h-5 w-5" />}
        </div>
      )}
    </li>
  )
}

const ListGroup: React.FC<ListGroupProps> = ({
  items,
  onItemSelect,
  onItemsReorder,
  multiSelect = false,
  searchable = false,
  maxHeight = '400px',
  animationDuration = 0.2,
  customItemRender,
  groupBy,
  theme = 'light',
  virtualizeThreshold = 100,
  loadMoreItems,
  selectedItemIds = [],
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(selectedItemIds))
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [listItems, setListItems] = useState<ListItem[]>(items)
  const [isLoading, setIsLoading] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredItems = listItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedItems = groupBy
    ? filteredItems.reduce((acc, item) => {
        const group = groupBy(item)
        if (!acc[group]) {
          acc[group] = []
        }
        acc[group].push(item)
        return acc
      }, {} as Record<string, ListItem[]>)
    : { 'default': filteredItems }

  const handleItemClick = useCallback((id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev)
      if (multiSelect) {
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
      } else {
        newSet.clear()
        newSet.add(id)
      }
      return newSet
    })
    const selectedItem = listItems.find(item => item.id === id)
    if (selectedItem) {
      onItemSelect?.(selectedItem)
    }
  }, [listItems, multiSelect, onItemSelect])

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      const currentIndex = filteredItems.findIndex(item => selectedItems.has(item.id))
      let nextIndex = (currentIndex + direction + filteredItems.length) % filteredItems.length
      handleItemClick(filteredItems[nextIndex].id)
    }
  }, [filteredItems, handleItemClick, selectedItems])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setListItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        onItemsReorder?.(newItems)
        return newItems
      })
    }
  }

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  const loadMore = async () => {
    if (loadMoreItems && !isLoading) {
      setIsLoading(true)
      try {
        const newItems = await loadMoreItems()
        setListItems(prev => [...prev, ...newItems])
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector('[aria-selected="true"]') as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedItems])

  useEffect(() => {
    setSelectedItems(new Set(selectedItemIds))
  }, [selectedItemIds])

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  const themeClasses = theme === 'dark'
    ? 'bg-gray-800 text-white'
    : 'bg-white text-gray-800'

  const renderGroup = (group: string, groupItems: ListItem[]) => (
    <div key={group}>
      <button
        className="w-full text-left px-4 py-2 font-semibold flex items-center justify-between"
        onClick={() => toggleGroup(group)}
      >
        {group}
        {expandedGroups.has(group) ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      </button>
      {expandedGroups.has(group) && (
        <AnimatePresence>
          {groupItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: animationDuration }}
            >
              <SortableItem
                item={item}
                isSelected={selectedItems.has(item.id)}
                onClick={() => handleItemClick(item.id)}
                customRender={customItemRender}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  )

  const renderVirtualizedList = () => (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={filteredItems.length}
          itemSize={50}
          width={width}
        >
          {({ index, style }) => (
            <div style={style} key={filteredItems[index].id}>
              <SortableItem
                item={filteredItems[index]}
                isSelected={selectedItems.has(filteredItems[index].id)}
                onClick={() => handleItemClick(filteredItems[index].id)}
                customRender={customItemRender}
              />
            </div>
          )}
        </List>
      )}
    </AutoSizer>
  )

  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${themeClasses}`}>
      {searchable && (
        <div className="p-2">
          <input
            type="text"
            placeholder="搜索..."
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredItems}
          strategy={verticalListSortingStrategy}
        >
          <ul
            ref={listRef}
            className={`overflow-y-auto`}
            style={{ maxHeight }}
            role="listbox"
            aria-multiselectable={multiSelect}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            {filteredItems.length > virtualizeThreshold
              ? renderVirtualizedList()
              : Object.entries(groupedItems).map(([group, groupItems]) =>
                  renderGroup(group, groupItems)
                )}
          </ul>
        </SortableContext>
      </DndContext>
      {loadMoreItems && (
        <button
          className="w-full py-2 text-center text-blue-500 hover:text-blue-600"
          onClick={loadMore}
          disabled={isLoading}
        >
          {isLoading ? '加载中...' : '加载更多'}
        </button>
      )}
    </div>
  )
}

export default ListGroup

