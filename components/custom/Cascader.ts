import { ReactNode } from 'react'

export interface CascaderOption {
  label: string
  value: string | number
  disabled?: boolean
  children?: CascaderOption[]
  [key: string]: any
}

export interface CascaderProps {
  options: CascaderOption[]
  placeholder?: string
  multiple?: boolean
  clearable?: boolean
  disabled?: boolean
  showPath?: boolean
  separator?: string
  expandTrigger?: 'click' | 'hover'
  filterable?: boolean
  onChange?: (
    value: (string | number)[],
    selectedOptions: CascaderOption[],
    path: CascaderOption[]
  ) => void
  renderLabel?: (option: CascaderOption, checked: boolean) => ReactNode
}

export interface CascaderMenuProps {
  options: CascaderOption[]
  onSelect: (option: CascaderOption, path: CascaderOption[]) => void
  selectedOptions: CascaderOption[]
  multiple: boolean
  expandTrigger: 'click' | 'hover'
  renderLabel?: (option: CascaderOption, checked: boolean) => ReactNode
  searchValue: string
}

