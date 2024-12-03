import React, { useState, useMemo } from 'react'
import { CascaderMenuProps, CascaderOption } from './Cascader'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CascaderMenu: React.FC<CascaderMenuProps> = ({
  options,
  onSelect,
  selectedOptions,
  multiple,
  expandTrigger,
  renderLabel,
  searchValue,
}) => {
  const [activeOptions, setActiveOptions] = useState<CascaderOption[]>([])

  const handleOptionClick = (option: CascaderOption, level: number) => {
    const newActiveOptions = [...activeOptions.slice(0, level), option]
    setActiveOptions(newActiveOptions)

    if (!option.children || option.children.length === 0) {
      onSelect(option, newActiveOptions)
    }
  }

  const handleOptionHover = (option: CascaderOption, level: number) => {
    if (expandTrigger === 'hover') {
      const newActiveOptions = [...activeOptions.slice(0, level), option]
      setActiveOptions(newActiveOptions)
    }
  }

  const filterOptions = (options: CascaderOption[], searchValue: string): CascaderOption[] => {
    return options.filter((option) => {
      const matchesSearch = option.label.toLowerCase().includes(searchValue.toLowerCase())
      const hasMatchingChildren = option.children && filterOptions(option.children, searchValue).length > 0
      return matchesSearch || hasMatchingChildren
    })
  }

  const filteredOptions = useMemo(() => {
    return searchValue ? filterOptions(options, searchValue) : options
  }, [options, searchValue])

  const renderOptions = (levelOptions: CascaderOption[], level: number) => {
    return (
      <ul className="min-w-[160px] max-h-60 overflow-y-auto border-r border-gray-200">
        <AnimatePresence>
          {levelOptions.map((option) => {
            const isSelected = selectedOptions.some((o) => o.value === option.value)
            const isActive = activeOptions[level]?.value === option.value

            return (
              <motion.li
                key={option.value}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100' : ''
                }`}
                onClick={() => handleOptionClick(option, level)}
                onMouseEnter={() => handleOptionHover(option, level)}
              >
                <div className="flex items-center justify-between">
                  {renderLabel ? (
                    renderLabel(option, isSelected)
                  ) : (
                    <span>{option.label}</span>
                  )}
                  {multiple && isSelected && <Check size={16} className="text-blue-500" />}
                  {option.children && option.children.length > 0 && (
                    <span className="ml-2">›</span>
                  )}
                </div>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    )
  }

  const renderMenus = () => {
    const menus = [renderOptions(filteredOptions, 0)]

    for (let i = 0; i < activeOptions.length; i++) {
      const option = activeOptions[i]
      if (option.children && option.children.length > 0) {
        menus.push(renderOptions(option.children, i + 1))
      }
    }

    return menus
  }

  return (
    <div className="absolute z-10 mt-1 bg-white border rounded-md shadow-lg flex">
      {renderMenus()}
    </div>
  )
}

export default CascaderMenu

